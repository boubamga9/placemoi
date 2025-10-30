/**
 * Export centralisé de tous les schémas de validation
 * 
 * Ce fichier permet d'importer facilement tous les schémas
 * depuis un seul endroit : import { ... } from '$lib/validations'
 */

// ===== SCHÉMAS COMMUNS =====
export * from './schemas/common';

// ===== AUTHENTIFICATION =====
export * from './schemas/auth';

// ===== FORMULAIRE DE CONTACT =====
export * from './schemas/contact';

// ===== ÉVÉNEMENTS ET PLACEMENT =====
export * from './schemas/event';
