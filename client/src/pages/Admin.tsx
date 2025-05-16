import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
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
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((res) => {
        if (!res.ok) {
          window.location.href = "/signin";
        } else {
          setIsAuthorized(true);
        }
      })
      .catch(() => {
        window.location.href = "/signin";
      });
  }, []);

  const { data: metrics } = useQuery({
    queryKey: ["metrics"],
    queryFn: () => fetch("/api/metrics").then((res) => res.json()),
  });

  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => fetch("/api/subjects").then((res) => res.json()),
  });

  const { data: articles } = useQuery({
    queryKey: ["articles"],
    queryFn: () => fetch("/api/articles").then((res) => res.json()),
  });

  const createArticle = useMutation({
    mutationFn: (newArticle: any) =>
      fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArticle),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(["articles"]);
      setSelectedArticle(null);
    },
  });

  const updateArticle = useMutation({
    mutationFn: (article: any) =>
      fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(["articles"]);
      setSelectedArticle(null);
    },
  });

  const deleteArticle = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/articles/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["articles"]);
    },
  });

  if (!isAuthorized) return null;

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">{t("admin.dashboard")}</h1>

        <Tabs defaultValue="metrics">
          <TabsList>
            <TabsTrigger value="metrics">{t("admin.metrics")}</TabsTrigger>
            <TabsTrigger value="articles">{t("admin.articles")}</TabsTrigger>
            <TabsTrigger value="users">{t("admin.users")}</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.totalViews")}</CardTitle>
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
                {t("admin.createArticle")}
              </Button>

              {selectedArticle && (
                <Card className="p-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const languages = ["en", "es", "fr", "ar"];
                      const translations: any = {};
                      const availableLanguages: string[] = [];

                      languages.forEach((lang) => {
                        const hasContent =
                          formData.get(`title_${lang}`) &&
                          formData.get(`excerpt_${lang}`) &&
                          formData.get(`content_${lang}`);
                        if (hasContent) {
                          availableLanguages.push(lang);
                          translations[lang] = {
                            title: formData.get(`title_${lang}`),
                            excerpt: formData.get(`excerpt_${lang}`),
                            content: formData.get(`content_${lang}`),
                            notes: formData
                              .get(`notes_${lang}`)
                              ?.toString()
                              .split("\n")
                              .filter(Boolean) || [],
                            resources: formData
                              .get(`resources_${lang}`)
                              ?.toString()
                              .split("\n")
                              .filter(Boolean) || [],
                          };
                        }
                      });

                      const article = {
                        ...selectedArticle,
                        title: formData.get("title_en"),
                        slug: formData.get("slug"),
                        excerpt: formData.get("excerpt_en"),
                        content: formData.get("content_en"),
                        imageUrl: formData.get("imageUrl"),
                        readTime: parseInt(formData.get("readTime") as string),
                        subjectId: parseInt(formData.get("subjectId") as string),
                        author: formData.get("author"),
                        authorImage: formData.get("authorImage"),
                        featured: formData.get("featured") === "true",
                        translations,
                        availableLanguages,
                        publishDate: new Date(),
                      };

                      if (selectedArticle.id) {
                        updateArticle.mutate(article);
                      } else {
                        createArticle.mutate(article);
                      }
                    }}
                  >
                    <div className="space-y-6">
                      <div className="flex items-center space-x-2">
                        <Input name="slug" defaultValue={selectedArticle.slug} placeholder="URL Slug" required />
                        <Input name="readTime" type="number" defaultValue={selectedArticle.readTime} placeholder="Read Time" required />
                        <Select name="subjectId" defaultValue={selectedArticle.subjectId?.toString()}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects?.map((subject) => (
                              <SelectItem key={subject.id} value={subject.id.toString()}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Input name="author" defaultValue={selectedArticle.author} placeholder="Author" required />
                        <Input name="authorImage" defaultValue={selectedArticle.authorImage} placeholder="Author Image URL" required />
                        <Input name="imageUrl" defaultValue={selectedArticle.imageUrl} placeholder="Article Cover Image URL" required />
                      </div>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="featured"
                          value="true"
                          defaultChecked={selectedArticle.featured}
                          className="h-4 w-4"
                        />
                        <span>Featured Article</span>
                      </label>

                      <Tabs defaultValue="en">
                        <TabsList>
                          {["en", "es", "fr", "ar"].map((lang) => (
                            <TabsTrigger key={lang} value={lang}>{lang.toUpperCase()}</TabsTrigger>
                          ))}
                        </TabsList>
                        {["en", "es", "fr", "ar"].map((lang) => (
                          <TabsContent key={lang} value={lang} className="space-y-4">
                            <Input name={`title_${lang}`} defaultValue={selectedArticle.translations?.[lang]?.title} placeholder={`Title (${lang})`} required={lang === "en"} dir={lang === "ar" ? "rtl" : "ltr"} />
                            <Textarea name={`excerpt_${lang}`} defaultValue={selectedArticle.translations?.[lang]?.excerpt} placeholder={`Excerpt (${lang})`} required={lang === "en"} dir={lang === "ar" ? "rtl" : "ltr"} />
                            <Textarea name={`content_${lang}`} defaultValue={selectedArticle.translations?.[lang]?.content} placeholder={`Content (${lang})`} required={lang === "en"} className="min-h-[200px]" dir={lang === "ar" ? "rtl" : "ltr"} />
                            <Textarea name={`notes_${lang}`} defaultValue={selectedArticle.translations?.[lang]?.notes?.join("\n")} placeholder={`Notes (${lang})`} dir={lang === "ar" ? "rtl" : "ltr"} />
                            <Textarea name={`resources_${lang}`} defaultValue={selectedArticle.translations?.[lang]?.resources?.join("\n")} placeholder={`Resources (${lang})`} dir={lang === "ar" ? "rtl" : "ltr"} />
                          </TabsContent>
                        ))}
                      </Tabs>

                      <div className="flex gap-2">
                        <Button type="submit">
                          {selectedArticle.id ? t("admin.updateArticle") : t("admin.createArticle")}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setSelectedArticle(null)}>
                          {t("admin.cancel")}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Card>
              )}

              <div className="grid gap-4">
                {articles?.map((article: any) => (
                  <Card key={article.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{article.title}</h3>
                        <p className="text-sm text-gray-500">{article.excerpt}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setSelectedArticle(article)}>
                          {t("admin.edit")}
                        </Button>
                        <Button variant="destructive" onClick={() => deleteArticle.mutate(article.id)}>
                          {t("admin.delete")}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <p>{t("admin.usersComingSoon")}</p>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}