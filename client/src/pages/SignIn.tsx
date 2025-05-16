
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SignIn() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("signin");

  const AuthButtons = ({ mode }) => (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => window.location.href = `/api/auth/google?mode=${mode}`}
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

      <form className="space-y-4">
        {mode === 'signup' ? (
          <>
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
          </>
        ) : null}
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            required
          />
        </div>
        {mode === 'signup' && (
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              required
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
        {mode === 'signin' && (
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">{t('auth.no_account')} </span>
            <button 
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              onClick={() => setActiveTab('signup')}
            >
              {t('auth.create_account')}
            </button>
          </div>
        )}
      </form>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md">
          <Tabs defaultValue="signin" className="w-full" onValueChange={setActiveTab}>
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
