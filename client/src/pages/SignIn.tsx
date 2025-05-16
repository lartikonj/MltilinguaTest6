import { useTranslation } from "react-i18next";
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const switchToSignup = () => {
    setActiveTab("signup");
  };

  const AuthButtons = ({ mode }: { mode: 'signin' | 'signup' }) => (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        className="w-full"
        onClick={async () => {
          try {
            const response = await fetch('/api/auth/google/init');
            const { url } = await response.json();
            window.location.href = url;
          } catch (error) {
            console.error('Google auth error:', error);
          }
        }}
      >
        {t('auth.oauth_message')} {t('auth.google')}
      </Button>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => window.location.href = `/api/auth/facebook?mode=${mode}`}
      >
        {t('auth.oauth_message')} {t('auth.facebook')}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
            {t('auth.or')}
          </span>
        </div>
      </div>

      <form className="space-y-4" onSubmit={(e) => handleSubmit(e, mode)}>
        {mode === 'signup' && (
          <>
            <div>
              <Input
                type="text"
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        <div>
          <Input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              inputMode="email"
            />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {mode === 'signup' && (
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              required
              onChange={handleChange}
            />
          </div>
        )}
        <Button 
          variant="outline" 
          className="w-full"
          type="submit"
        >
          {mode === 'signup' ? t('auth.create_account') : t('auth.signin_with')} {t('auth.email')}
        </Button>
      </form>
      {mode === 'signin' && (
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">{t('auth.no_account')} </span>
          <Button
            type="button"
            variant="link"
            className="text-primary-600 dark:text-primary-400 p-0"
            onClick={switchToSignup}
          >
            {t('auth.create_account')}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md">
          <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t('auth.signin')}</TabsTrigger>
              <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-6">
              <h2 className="text-2xl font-bold text-center mb-6">{t('auth.welcome_back')}</h2>
              <AuthButtons mode="signin" />
            </TabsContent>
            <TabsContent value="signup" className="mt-6">
              <h2 className="text-2xl font-bold text-center mb-6">{t('auth.create_account')}</h2>
              <AuthButtons mode="signup" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}