
'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Edit3, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  // Optional fields that might come from the blog writer module
  outline?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string; 
  updatedAt?: string;
}

const BLOG_POSTS_STORAGE_KEY = 'blogPosts';

const BlogManagementPage = () => {
  const { toast } = useToast();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>({ title: '', content: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedPosts = localStorage.getItem(BLOG_POSTS_STORAGE_KEY);
    if (storedPosts) {
      try {
        setBlogPosts(JSON.parse(storedPosts));
      } catch (error) {
        console.error("Failed to parse blog posts from localStorage", error);
        setBlogPosts([]); // Fallback to empty array on error
         toast({
          title: "Error Loading Posts",
          description: "Could not load posts from local storage. Data might be corrupted.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const savePostsToLocalStorage = (posts: BlogPost[]) => {
    try {
      localStorage.setItem(BLOG_POSTS_STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error("Failed to save posts to localStorage", error);
      toast({
        title: "Storage Error",
        description: "Could not save posts. Your browser's local storage might be full or disabled.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const updatedPosts = blogPosts.filter(post => post.id !== id);
    setBlogPosts(updatedPosts);
    savePostsToLocalStorage(updatedPosts);
    toast({ title: 'Post Deleted', description: 'The blog post has been successfully deleted.' });
  };

  const handleSaveEdit = () => {
    if (currentPost) {
      const updatedPost = { ...currentPost, updatedAt: new Date().toISOString() };
      const updatedPosts = blogPosts.map(post => (post.id === updatedPost.id ? updatedPost : post));
      setBlogPosts(updatedPosts);
      savePostsToLocalStorage(updatedPosts);
      setIsEditDialogOpen(false);
      setCurrentPost(null);
      toast({ title: 'Post Updated', description: 'Changes to the blog post have been saved.' });
    }
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({ title: 'Error', description: 'Title and content cannot be empty.', variant: 'destructive' });
      return;
    }
    const postToAdd: BlogPost = {
      ...newPost,
      id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedPosts = [...blogPosts, postToAdd];
    setBlogPosts(updatedPosts);
    savePostsToLocalStorage(updatedPosts);
    setNewPost({ title: '', content: '' });
    setIsCreateDialogOpen(false);
    toast({ title: 'Post Created', description: 'New blog post has been successfully created.' });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: 'new' | 'edit') => {
    const { name, value } = e.target;
    if (type === 'new') {
      setNewPost(prev => ({ ...prev, [name]: value }));
    } else if (currentPost) {
      setCurrentPost(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const filteredBlogPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-3xl font-bold text-primary">Blog Management</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Post
            </Button>
          </div>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Search posts by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredBlogPosts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Title</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogPosts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(post)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(post.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-lg">
                {searchTerm ? "No posts match your search." : "No blog posts yet. Create your first one!"}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Showing {filteredBlogPosts.length} of {blogPosts.length} posts.
          </p>
        </CardFooter>
      </Card>

      {/* Edit Blog Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          {currentPost && (
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="editTitle">Title</Label>
                <Input
                  id="editTitle"
                  name="title"
                  value={currentPost.title}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  className="text-lg"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="editContent">Content</Label>
                <Textarea
                  id="editContent"
                  name="content"
                  value={currentPost.content}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  rows={10}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Blog Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="space-y-1">
              <Label htmlFor="newTitle">Title</Label>
              <Input
                id="newTitle"
                name="title"
                value={newPost.title}
                onChange={(e) => handleInputChange(e, 'new')}
                className="text-lg"
                placeholder="Enter blog post title"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newContent">Content</Label>
              <Textarea
                id="newContent"
                name="content"
                value={newPost.content}
                onChange={(e) => handleInputChange(e, 'new')}
                rows={10}
                placeholder="Write your blog post content here..."
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreatePost}>Create Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagementPage;

