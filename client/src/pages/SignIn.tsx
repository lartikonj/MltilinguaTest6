import { useState, useCallback } from "react";
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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, mode: 'signin' | 'signup') => {
    e.preventDefault();

    if (!formData.email || !formData.password || (mode === 'signup' && (!formData.name || !formData.username))) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const endpoint = mode === 'signup' ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      window.location.href = data.user?.role === 'admin' ? '/admin' : '/';
    } catch (error) {
      console.error(`${mode} error:`, error);
      alert(error.message || `Failed to ${mode}`);
    }
  };

  const AuthForm = ({ mode }: { mode: 'signin' | 'signup' }) => (
    <div className="space-y-4">
      <div className="space-y-4">
        <form className="space-y-4" onSubmit={(e) => handleSubmit(e, mode)}>
          {mode === 'signup' && (
            <>
              <Input
                type="text"
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-background"
              />
              <Input
                type="text"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="bg-background"
              />
            </>
          )}
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-background"
            inputMode="email"
          />
          <Input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-background"
          />
          {mode === 'signup' && (
            <Input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="bg-background"
            />
          )}
          <Button 
            type="submit"
            className="w-full"
          >
            {mode === 'signup' ? t('auth.create_account') : t('auth.signin')}
          </Button>
        </form>

        {mode === 'signin' && (
          <div className="text-center text-sm">
            <span className="text-muted-foreground">{t('auth.no_account')} </span>
            <Button
              type="button"
              variant="link"
              className="p-0"
              onClick={() => setActiveTab('signup')}
            >
              {t('auth.create_account')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 bg-card p-6 rounded-lg shadow-lg">
          <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t('auth.signin')}</TabsTrigger>
              <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-6">
              <h2 className="text-2xl font-bold text-center mb-6">{t('auth.welcome_back')}</h2>
              <AuthForm mode="signin" />
            </TabsContent>
            <TabsContent value="signup" className="mt-6">
              <h2 className="text-2xl font-bold text-center mb-6">{t('auth.create_account')}</h2>
              <AuthForm mode="signup" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}