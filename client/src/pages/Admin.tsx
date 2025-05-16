
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

export default function Admin() {
  const { t } = useTranslation();
  const { data: metrics } = useQuery(['metrics'], () => 
    fetch('/api/metrics').then(res => res.json())
  );
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">{t('admin.dashboard')}</h1>
        
        <Tabs defaultValue="metrics">
          <TabsList>
            <TabsTrigger value="metrics">{t('admin.metrics')}</TabsTrigger>
            <TabsTrigger value="users">{t('admin.users')}</TabsTrigger>
            <TabsTrigger value="content">{t('admin.content')}</TabsTrigger>
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
          
          <TabsContent value="users">
            {/* User management will be added here */}
          </TabsContent>
          
          <TabsContent value="content">
            {/* Content management will be added here */}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
