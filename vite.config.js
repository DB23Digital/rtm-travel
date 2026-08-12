import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: './',
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        pillar: resolve(__dirname, 'corporate-travel-management.html'),
        articles: resolve(__dirname, 'articles.html'),
        dutyOfCare: resolve(__dirname, 'duty-of-care-business-travel.html'),
        travelPolicy: resolve(__dirname, 'corporate-travel-policy-template.html'),
        travelBudget: resolve(__dirname, 'corporate-travel-budget-south-africa.html'),
        portalLanding: resolve(__dirname, 'rtm-portal-landing.html'),
        processWorkflow: resolve(__dirname, 'rtm-process-workflow.html'),
        travelRequestForm: resolve(__dirname, 'rtm-travel-request-form.html'),
        sarsDeclaration: resolve(__dirname, 'sars-online-traveller-declaration-business-travel.html'),
        privacyPolicy: resolve(__dirname, 'privacy-policy.html')
      }
    }
  }
})
