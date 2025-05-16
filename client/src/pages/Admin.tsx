
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Admin() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedArticle, setSelectedArticle] = useState(null);

  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => fetch('/api/metrics').then(res => res.json())
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => fetch('/api/subjects').then(res => res.json())
  });

  const { data: articles } = useQuery({
    queryKey: ['articles'],
    queryFn: () => fetch('/api/articles').then(res => res.json())
  });

  const createArticle = useMutation({
    mutationFn: (newArticle) => 
      fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(['articles']);
      setSelectedArticle(null);
    }
  });

  const updateArticle = useMutation({
    mutationFn: (article) =>
      fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(['articles']);
      setSelectedArticle(null);
    }
  });

  const deleteArticle = useMutation({
    mutationFn: (id) =>
      fetch(`/api/articles/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['articles']);
    }
  });

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">{t('admin.dashboard')}</h1>
        
        <Tabs defaultValue="metrics">
          <TabsList>
            <TabsTrigger value="metrics">{t('admin.metrics')}</TabsTrigger>
            <TabsTrigger value="articles">{t('admin.articles')}</TabsTrigger>
            <TabsTrigger value="users">{t('admin.users')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.totalViews')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{metrics?.totalViews || 0}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="articles">
            <div className="space-y-4">
              <Button onClick={() => setSelectedArticle({})}>
                {t('admin.createArticle')}
              </Button>

              {selectedArticle && (
                <Card className="p-4">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const article = {
                      ...selectedArticle,
                      title: formData.get('title'),
                      slug: formData.get('slug'),
                      excerpt: formData.get('excerpt'),
                      content: formData.get('content'),
                      imageUrl: formData.get('imageUrl'),
                      readTime: parseInt(formData.get('readTime')),
                      subjectId: parseInt(formData.get('subjectId')),
                      author: formData.get('author'),
                      authorImage: formData.get('authorImage'),
                      translations: { en: {
                        title: formData.get('title'),
                        excerpt: formData.get('excerpt'),
                        content: formData.get('content')
                      }},
                      availableLanguages: ['en']
                    };
                    
                    if (selectedArticle.id) {
                      updateArticle.mutate(article);
                    } else {
                      createArticle.mutate(article);
                    }
                  }}>
                    <div className="space-y-4">
                      <Input name="title" defaultValue={selectedArticle.title} placeholder="Title" required />
                      <Input name="slug" defaultValue={selectedArticle.slug} placeholder="Slug" required />
                      <Textarea name="excerpt" defaultValue={selectedArticle.excerpt} placeholder="Excerpt" required />
                      <Textarea name="content" defaultValue={selectedArticle.content} placeholder="Content" required />
                      <Input name="imageUrl" defaultValue={selectedArticle.imageUrl} placeholder="Image URL" required />
                      <Input name="readTime" type="number" defaultValue={selectedArticle.readTime} placeholder="Read Time (minutes)" required />
                      <Select name="subjectId" defaultValue={selectedArticle.subjectId?.toString()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects?.map(subject => (
                            <SelectItem key={subject.id} value={subject.id.toString()}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input name="author" defaultValue={selectedArticle.author} placeholder="Author" required />
                      <Input name="authorImage" defaultValue={selectedArticle.authorImage} placeholder="Author Image URL" required />
                      <div className="flex gap-2">
                        <Button type="submit">
                          {selectedArticle.id ? t('admin.updateArticle') : t('admin.createArticle')}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setSelectedArticle(null)}>
                          {t('admin.cancel')}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Card>
              )}

              <div className="grid gap-4">
                {articles?.map(article => (
                  <Card key={article.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{article.title}</h3>
                        <p className="text-sm text-gray-500">{article.excerpt}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setSelectedArticle(article)}>
                          {t('admin.edit')}
                        </Button>
                        <Button variant="destructive" onClick={() => deleteArticle.mutate(article.id)}>
                          {t('admin.delete')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            {/* User management will be added here */}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
