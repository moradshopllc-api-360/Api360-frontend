"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    "auth.login.title": "Login to your account",
    "auth.login.description": "Please enter your details to login.",
    "auth.login.noAccount": "Don't have an account?",
    "auth.login.register": "Register",
    "auth.login.orContinueWith": "or",
    "auth.register.title": "Create your account",
    "auth.register.description": "Please enter your details to register.",
    "auth.register.hasAccount": "Already have an account?",
    "auth.register.login": "Login",
    "Get started": "Get started",
    "Create a new account": "Create a new account",
    "or": "or",
    "common.readyToLaunch": "Ready to launch?",
    "common.readyToLaunchDesc": "Clone the repo, install dependencies, and your dashboard is live in minutes.",
    "common.needHelp": "Need help?",
    "common.needHelpDesc": "Check out the docs or open an issue on GitHub, community support is just a click away.",
    "common.tagline": "Design. Build. Launch. Repeat.",
  },
  es: {
    "auth.login.title": "Inicia sesión en tu cuenta",
    "auth.login.description": "Por favor, introduce tus datos para iniciar sesión.",
    "auth.login.noAccount": "¿No tienes una cuenta?",
    "auth.login.register": "Registrarse",
    "auth.login.orContinueWith": "o",
    "auth.register.title": "Crear tu cuenta",
    "auth.register.description": "Por favor, introduce tus datos para registrarte.",
    "auth.register.hasAccount": "¿Ya tienes una cuenta?",
    "auth.register.login": "Iniciar sesión",
    "Get started": "Comenzar",
    "Create a new account": "Crear una nueva cuenta",
    "or": "o",
    "common.readyToLaunch": "¿Listo para lanzar?",
    "common.readyToLaunchDesc": "Clona el repositorio, instala las dependencias y tu panel estará activo en minutos.",
    "common.needHelp": "¿Necesitas ayuda?",
    "common.needHelpDesc": "Consulta la documentación o abre un issue en GitHub, el soporte de la comunidad está a un solo clic.",
    "common.tagline": "Diseñar. Construir. Lanzar. Repetir.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}