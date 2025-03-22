import { create } from 'zustand';

export interface Project {
  created_at: string;
  description: string;
  domain_list: string;
  id: number;
  email_count: number;
  name: string;
  url_slug: string;
  labels?: Label[];
  last_synced_at?: string;
}

export interface DomainStats {
  domain: string;
  count: number;
  image: string;
}
export interface Label {
  id: string;
  name: string;
  type: string;
  messagesTotal: number;
  messagesUnread: number;
  color: { textColor?: string; backgroundColor?: string; } | null;
  messageListVisibility: string | null;
  labelListVisibility: string | null;
}

export interface EmailLabels {
  categories: Label[];
  labels: Label[];
}

interface ProjectsState {
  projects: Project[];
  domainStats: DomainStats[];
  labels: EmailLabels;
  isLoading: boolean;
  setProjects: (projects: Project[]) => void;
  setDomainStats: (stats: DomainStats[]) => void;
  setLabels: (labels: EmailLabels) => void;
  addProject: (project: Project) => void;
  removeProject: (id: number) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useProjectsStore = create<ProjectsState>()((set) => ({
  projects: [],
  domainStats: [],
  labels: { categories: [], labels: [] },
  isLoading: false,
  setProjects: (projects) => set({ projects }),
  setDomainStats: (stats) => set({ domainStats: stats }),
  setLabels: (labels) => set({ labels }),
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    })),
  updateProject: (id, updatedProject) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...updatedProject } : project
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));