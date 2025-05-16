import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">{t('auth.welcome')}</h2>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = "/api/auth/google"}
            >
              {t('auth.oauth_message')} {t('auth.google')}
            </Button>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = "/api/auth/facebook"}
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

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = "/api/auth/email"}
            >
              {t('auth.oauth_message')} {t('auth.email')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}