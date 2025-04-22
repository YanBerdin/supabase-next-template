"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function EnvVarChecker() {
  const [showVars, setShowVars] = useState(false);
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const allVarsPresent = supabaseUrl && supabaseAnonKey;
  
  return (
    <div className="border rounded-lg p-4 mb-4 bg-slate-50 dark:bg-slate-900">
      <h2 className="text-lg font-medium mb-2">Variables d&apos;environnement Supabase</h2>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-64">NEXT_PUBLIC_SUPABASE_URL:</span>
          <Badge variant={supabaseUrl ? "default" : "destructive"}>
            {supabaseUrl ? "Définie ✓" : "Non définie ✗"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="inline-block w-64">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
          <Badge variant={supabaseAnonKey ? "default" : "destructive"}>
            {supabaseAnonKey ? "Définie ✓" : "Non définie ✗"}
          </Badge>
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        {!allVarsPresent && (
          <p className="text-red-500 text-sm mb-2">
            Certaines variables d&apos;environnement nécessaires ne sont pas définies.
            Votre application risque de ne pas fonctionner correctement.
          </p>
        )}
        
        <Button 
          onClick={() => setShowVars(!showVars)} 
          variant="outline"
          size="sm"
        >
          {showVars ? "Masquer les valeurs" : "Afficher les valeurs"}
        </Button>
      </div>
      
      {showVars && (
        <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
          <h3 className="text-sm font-medium mb-2">Valeurs des variables</h3>
          <pre className="text-xs overflow-x-auto">
            <code>
              NEXT_PUBLIC_SUPABASE_URL: {supabaseUrl || "non définie"}{"\n"}
              NEXT_PUBLIC_SUPABASE_ANON_KEY: {supabaseAnonKey ? "***" + supabaseAnonKey.slice(-6) : "non définie"}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}