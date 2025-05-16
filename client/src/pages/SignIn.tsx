
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

export default function SignIn() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("signin");
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    username: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value.trim()
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, mode: 'signin' | 'signup') => {
    e.preventDefault();
    
    try {
      const endpoint = mode === 'signup' ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name
        })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      window.location.href = data.role === 'admin' ? '/admin' : '/';
    } catch (error: any) {
      console.error(`${mode} error:`, error);
      const errorMessage = error.message === 'Server returned non-JSON response' 
        ? 'Server error, please try again'
        : error.message || `Failed to ${mode}`;
      alert(errorMessage);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 bg-card p-6 rounded-lg shadow-lg">
          <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t('auth.signin')}</TabsTrigger>
              <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={(e) => handleSubmit(e, 'signin')} className="space-y-4">
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button type="submit" className="w-full">
                  {t('auth.signin')}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={(e) => handleSubmit(e, 'signup')} className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <Button type="submit" className="w-full">
                  {t('auth.create_account')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
