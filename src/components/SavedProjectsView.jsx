import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  FolderPlus,
  FolderOpen,
  Code,
  Search,
  Plus,
  Copy,
  Edit2,
  Trash2,
  ChevronRight,
  ArrowUpDown,
  MoreVertical,
  Check,
  X,
  FileCode,
  Tag,
} from "lucide-react";
import clsx from "clsx";
import { useAppStore } from "../store/useAppStore";
import { getProjectLimit } from "../lib/planFeatures";

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: "easeOut" },
};

export default function SavedProjectsView({ onOpenIde }) {
  const {
    projects,
    openProject,
    loadProjects,
    newProject,
    deleteProject,
    renameProject,
    duplicateProject,
    profile,
    user,
    setShowUpgradePrompt,
  } = useAppStore();

  const userId = user?.id || "guest";
  const limit = getProjectLimit(profile?.plan);

  // Folders state
  const [folders, setFolders] = useState(() => {
    try {
      const stored = localStorage.getItem(`xenon-folders-${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Project-folder mapping: { [projectId]: folderId }
  const [projectFolders, setProjectFolders] = useState(() => {
    try {
      const stored = localStorage.getItem(`xenon-project-folders-${userId}`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [activeFolderId, setActiveFolderId] = useState("all"); // 'all' | 'unfiled' | folderId
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'oldest' | 'alphabetical'

  // Modals & Menus
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState(null); // { id, name }
  const [projectToMove, setProjectToMove] = useState(null); // project object
  const [projectToRename, setProjectToRename] = useState(null); // project object
  const [renameValue, setRenameValue] = useState("");
  const [projectToDelete, setProjectToDelete] = useState(null); // project object
  const [actionMenuProjectId, setActionMenuProjectId] = useState(null);

  // Sync folders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`xenon-folders-${userId}`, JSON.stringify(folders));
    } catch {}
  }, [folders, userId]);

  useEffect(() => {
    try {
      localStorage.setItem(`xenon-project-folders-${userId}`, JSON.stringify(projectFolders));
    } catch {}
  }, [projectFolders, userId]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Folder helper functions
  const handleCreateFolder = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    const newF = {
      id: `folder-${Date.now()}`,
      name: trimmed,
      createdAt: new Date().toISOString(),
    };
    setFolders((prev) => [...prev, newF]);
    setNewFolderName("");
    setShowNewFolderModal(false);
    setActiveFolderId(newF.id);
  };

  const handleRenameFolder = () => {
    if (!editingFolder || !editingFolder.name.trim()) return;
    setFolders((prev) =>
      prev.map((f) => (f.id === editingFolder.id ? { ...f, name: editingFolder.name.trim() } : f))
    );
    setEditingFolder(null);
  };

  const handleDeleteFolder = (folderId) => {
    // Unassign projects in this folder
    setProjectFolders((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((pId) => {
        if (next[pId] === folderId) delete next[pId];
      });
      return next;
    });
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    if (activeFolderId === folderId) setActiveFolderId("all");
  };

  const handleAssignFolder = (projectId, folderId) => {
    setProjectFolders((prev) => {
      const next = { ...prev };
      if (!folderId || folderId === "unfiled") {
        delete next[projectId];
      } else {
        next[projectId] = folderId;
      }
      return next;
    });
    setProjectToMove(null);
  };

  const handleDuplicate = async (project) => {
    try {
      const copy = await duplicateProject(project);
      if (copy?.id && projectFolders[project.id]) {
        // Copy the folder assignment
        handleAssignFolder(copy.id, projectFolders[project.id]);
      }
      setActionMenuProjectId(null);
    } catch (e) {
      alert(e?.message || "Could not duplicate project.");
    }
  };

  const handleRenameSubmit = async () => {
    if (!projectToRename || !renameValue.trim()) return;
    try {
      await renameProject(projectToRename.id, renameValue);
      setProjectToRename(null);
      setRenameValue("");
    } catch (e) {
      alert(e?.message || "Could not rename project.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id);
      // Remove folder association
      setProjectFolders((prev) => {
        const next = { ...prev };
        delete next[projectToDelete.id];
        return next;
      });
      setProjectToDelete(null);
      setActionMenuProjectId(null);
    } catch (e) {
      alert(e?.message || "Could not delete project.");
    }
  };

  // Filter & Sort
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Folder check
      const assignedFolder = projectFolders[project.id];
      if (activeFolderId === "unfiled") {
        if (assignedFolder) return false;
      } else if (activeFolderId !== "all") {
        if (assignedFolder !== activeFolderId) return false;
      }

      // Search check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (project.title || "").toLowerCase().includes(q);
        const matchesSnippet = (project.snippet || project.code || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesSnippet) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
      }
      if (sortBy === "oldest") {
        return new Date(a.updated_at || 0) - new Date(b.updated_at || 0);
      }
      if (sortBy === "alphabetical") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0;
    });
  }, [projects, projectFolders, activeFolderId, searchQuery, sortBy]);

  // Counts per folder
  const folderCounts = useMemo(() => {
    const counts = { all: projects.length, unfiled: 0 };
    folders.forEach((f) => (counts[f.id] = 0));
    projects.forEach((p) => {
      const fId = projectFolders[p.id];
      if (fId && counts[fId] !== undefined) {
        counts[fId]++;
      } else {
        counts.unfiled++;
      }
    });
    return counts;
  }, [projects, folders, projectFolders]);

  const activeFolderName = useMemo(() => {
    if (activeFolderId === "all") return "All Projects";
    if (activeFolderId === "unfiled") return "Uncategorized";
    const found = folders.find((f) => f.id === activeFolderId);
    return found ? found.name : "Folder";
  }, [activeFolderId, folders]);

  return (
    <motion.section className="space-y-6" {...motionProps}>
      {/* Top Header Card */}
      <div className="xenon-panel p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="xenon-kicker">Workspace Repository</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Saved Projects
            </h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Organize your Python scripts, classroom tasks, and projects into folders.
              {limit != null && (
                <span className="block mt-1 font-medium text-[var(--muted)]">
                  {projects.length} / {limit} projects used.{" "}
                  <button
                    type="button"
                    className="text-[var(--accent)] font-semibold hover:underline"
                    onClick={() => setShowUpgradePrompt(true)}
                  >
                    Upgrade for unlimited
                  </button>
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              className="xenon-btn px-4 py-2 text-xs"
              onClick={() => {
                try {
                  newProject();
                  onOpenIde();
                } catch (e) {
                  alert(e?.message || "Could not create project.");
                  setShowUpgradePrompt(true);
                }
              }}
              disabled={limit != null && projects.length >= limit}
            >
              <Plus className="h-4 w-4" />
              <span>New Lab Project</span>
            </button>
            <button
              type="button"
              className="xenon-btn-ghost px-3.5 py-2 text-xs"
              onClick={() => setShowNewFolderModal(true)}
            >
              <FolderPlus className="h-4 w-4" />
              <span>New Folder</span>
            </button>
          </div>
        </div>

        {/* Folders Navigation Strip */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pb-2">
          {/* All Projects Tab */}
          <button
            type="button"
            onClick={() => setActiveFolderId("all")}
            className={clsx(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
              activeFolderId === "all"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "bg-[var(--panel-soft)] text-[var(--muted)] hover:text-[var(--text)]"
            )}
          >
            <Folder className="h-3.5 w-3.5" />
            <span>All Projects</span>
            <span
              className={clsx(
                "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                activeFolderId === "all" ? "bg-white/20 text-white" : "bg-[var(--badge-bg)] text-[var(--muted)]"
              )}
            >
              {folderCounts.all}
            </span>
          </button>

          {/* Uncategorized Tab */}
          {folderCounts.unfiled > 0 && (
            <button
              type="button"
              onClick={() => setActiveFolderId("unfiled")}
              className={clsx(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
                activeFolderId === "unfiled"
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "bg-[var(--panel-soft)] text-[var(--muted)] hover:text-[var(--text)]"
              )}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>Uncategorized</span>
              <span
                className={clsx(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                  activeFolderId === "unfiled" ? "bg-white/20 text-white" : "bg-[var(--badge-bg)] text-[var(--muted)]"
                )}
              >
                {folderCounts.unfiled}
              </span>
            </button>
          )}

          {/* User Folders */}
          {folders.map((f) => {
            const isActive = activeFolderId === f.id;
            return (
              <div key={f.id} className="relative group inline-flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveFolderId(f.id)}
                  className={clsx(
                    "flex items-center gap-2 pl-3.5 pr-2 py-1.5 rounded-xl text-xs font-semibold transition-all",
                    isActive
                      ? "bg-[var(--accent)] text-white shadow-sm"
                      : "bg-[var(--panel-soft)] text-[var(--muted)] hover:text-[var(--text)]"
                  )}
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  <span>{f.name}</span>
                  <span
                    className={clsx(
                      "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                      isActive ? "bg-white/20 text-white" : "bg-[var(--badge-bg)] text-[var(--muted)]"
                    )}
                  >
                    {folderCounts[f.id] || 0}
                  </span>
                </button>
                {/* Folder Actions (Rename / Delete) */}
                <div className="hidden group-hover:flex items-center gap-0.5 ml-1 bg-[var(--panel)] border border-[var(--border)] rounded-lg p-0.5 shadow-sm">
                  <button
                    type="button"
                    className="p-1 text-[var(--muted)] hover:text-[var(--text)] rounded"
                    title="Rename Folder"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFolder(f);
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="p-1 text-[var(--muted)] hover:text-[var(--danger)] rounded"
                    title="Delete Folder"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete folder "${f.name}"? Projects inside will remain saved in Uncategorized.`)) {
                        handleDeleteFolder(f.id);
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[var(--border)]">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
            <input
              type="text"
              placeholder={`Search in ${activeFolderName}...`}
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-[var(--field-bg)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] text-[var(--muted)] flex items-center gap-1 font-medium">
              <ArrowUpDown className="h-3 w-3" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 px-3 rounded-xl bg-[var(--field-bg)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="newest">Recently Edited</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid / List */}
      {!filteredProjects.length ? (
        <div className="xenon-panel p-12 text-center border-dashed border border-[var(--border)]">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-[var(--panel-soft)] flex items-center justify-center text-[var(--muted)] mb-3">
            <FolderOpen className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--text)]">
            {searchQuery ? "No matching projects found" : `No projects in ${activeFolderName}`}
          </h3>
          <p className="mt-1 text-xs text-[var(--muted)] max-w-sm mx-auto">
            {searchQuery
              ? "Try adjusting your search terms or clearing the filter."
              : "Create a new Python lab project or move an existing one here."}
          </p>
          {!searchQuery && (
            <button
              type="button"
              className="xenon-btn mt-5 px-4 py-2 text-xs"
              onClick={() => {
                newProject();
                onOpenIde();
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Project</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const folderId = projectFolders[project.id];
            const currentFolder = folders.find((f) => f.id === folderId);
            const isMenuOpen = actionMenuProjectId === project.id;

            return (
              <div
                key={project.id}
                className="xenon-panel p-5 flex flex-col justify-between group relative transition-colors border border-[var(--border)] hover:border-[var(--border)]"
              >
                <div>
                  {/* Card Header: Title & Folder badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-semibold text-sm text-[var(--text)] truncate">
                          {project.title || "Untitled Project"}
                        </h3>
                      </div>
                      <p className="text-[10px] text-[var(--muted)] font-mono mt-0.5">
                        Updated {new Date(project.updated_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Action Menu Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActionMenuProjectId(isMenuOpen ? null : project.id)}
                        className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--panel-soft)] transition-colors"
                        title="Project options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {isMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-8 z-30 w-44 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-1.5 shadow-xl text-xs space-y-0.5"
                          >
                            <button
                              type="button"
                              className="flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg text-[var(--text)] hover:bg-[var(--panel-soft)] font-medium"
                              onClick={() => {
                                setProjectToRename(project);
                                setRenameValue(project.title || "Untitled Project");
                                setActionMenuProjectId(null);
                              }}
                            >
                              <Edit2 className="h-3.5 w-3.5 text-[var(--muted)]" />
                              <span>Rename</span>
                            </button>
                            <button
                              type="button"
                              className="flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg text-[var(--text)] hover:bg-[var(--panel-soft)] font-medium"
                              onClick={() => {
                                setProjectToMove(project);
                                setActionMenuProjectId(null);
                              }}
                            >
                              <Folder className="h-3.5 w-3.5 text-[var(--muted)]" />
                              <span>Move to folder...</span>
                            </button>
                            <button
                              type="button"
                              className="flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg text-[var(--text)] hover:bg-[var(--panel-soft)] font-medium"
                              onClick={() => handleDuplicate(project)}
                            >
                              <Copy className="h-3.5 w-3.5 text-[var(--muted)]" />
                              <span>Duplicate</span>
                            </button>
                            <div className="border-t border-[var(--border)] my-1" />
                            <button
                              type="button"
                              className="flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg text-[var(--danger)] hover:bg-[var(--danger)]/10 font-medium"
                              onClick={() => {
                                setProjectToDelete(project);
                                setActionMenuProjectId(null);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Folder Tag */}
                  <div className="mt-2.5 flex items-center gap-2">
                    {currentFolder ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--panel-soft)] text-[var(--muted)]">
                        <Folder className="h-2.5 w-2.5 text-[var(--accent)]" />
                        <span className="truncate max-w-[120px]">{currentFolder.name}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--panel-soft)] text-[var(--muted)] opacity-60">
                        <Tag className="h-2.5 w-2.5" />
                        <span>Unfiled</span>
                      </span>
                    )}
                  </div>

                  {/* Code snippet preview */}
                  <div className="mt-3 p-2.5 rounded-lg bg-[var(--code-bg)] border border-[var(--border)] font-mono text-[11px] text-[var(--muted)] line-clamp-3 overflow-hidden select-none">
                    {project.snippet || project.code || "# Empty file"}
                  </div>
                </div>

                {/* Card Action: Launch IDE */}
                <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      openProject(project);
                      onOpenIde();
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
                  >
                    <Code className="h-3.5 w-3.5" />
                    <span>Open in Python IDE</span>
                  </button>
                  <ChevronRight className="h-3.5 w-3.5 text-[var(--muted)]" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal: Create New Folder ── */}
      <AnimatePresence>
        {showNewFolderModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onClick={() => setShowNewFolderModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="xenon-panel w-full max-w-sm p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderPlus className="h-4 w-4 text-[var(--accent)]" />
                  <h3 className="font-bold text-sm text-[var(--text)]">New Folder</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="text-[var(--muted)] hover:text-[var(--text)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider block mb-1.5">
                  Folder Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. GCSE Paper 2, Homework Labs"
                  autoFocus
                  className="xenon-input text-xs"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateFolder();
                  }}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="xenon-btn-ghost px-3 py-1.5 text-xs"
                  onClick={() => setShowNewFolderModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="xenon-btn px-4 py-1.5 text-xs"
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                >
                  Create Folder
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Rename Folder ── */}
      <AnimatePresence>
        {editingFolder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onClick={() => setEditingFolder(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="xenon-panel w-full max-w-sm p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--text)]">Rename Folder</h3>
                <button
                  type="button"
                  onClick={() => setEditingFolder(null)}
                  className="text-[var(--muted)] hover:text-[var(--text)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <input
                type="text"
                autoFocus
                className="xenon-input text-xs"
                value={editingFolder.name}
                onChange={(e) => setEditingFolder({ ...editingFolder, name: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameFolder();
                }}
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="xenon-btn-ghost px-3 py-1.5 text-xs"
                  onClick={() => setEditingFolder(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="xenon-btn px-4 py-1.5 text-xs"
                  onClick={handleRenameFolder}
                  disabled={!editingFolder.name.trim()}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Move Project to Folder ── */}
      <AnimatePresence>
        {projectToMove && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onClick={() => setProjectToMove(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="xenon-panel w-full max-w-sm p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[var(--text)]">Move to Folder</h3>
                  <p className="text-[11px] text-[var(--muted)] truncate max-w-[240px]">
                    {projectToMove.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setProjectToMove(null)}
                  className="text-[var(--muted)] hover:text-[var(--text)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-60 overflow-y-auto xenon-scroll pr-1">
                {/* Unfiled option */}
                <button
                  type="button"
                  onClick={() => handleAssignFolder(projectToMove.id, null)}
                  className={clsx(
                    "flex w-full items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-left transition-colors",
                    !projectFolders[projectToMove.id]
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--panel-soft)] text-[var(--muted)] hover:text-[var(--text)]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="h-3.5 w-3.5" />
                    <span>No folder (Unfiled)</span>
                  </div>
                  {!projectFolders[projectToMove.id] && <Check className="h-3.5 w-3.5" />}
                </button>

                {/* Available folders */}
                {folders.map((f) => {
                  const isCurrent = projectFolders[projectToMove.id] === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleAssignFolder(projectToMove.id, f.id)}
                      className={clsx(
                        "flex w-full items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-left transition-colors",
                        isCurrent
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--panel-soft)] text-[var(--muted)] hover:text-[var(--text)]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Folder className="h-3.5 w-3.5" />
                        <span>{f.name}</span>
                      </div>
                      {isCurrent && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  className="xenon-btn-ghost px-4 py-1.5 text-xs"
                  onClick={() => setProjectToMove(null)}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Rename Project ── */}
      <AnimatePresence>
        {projectToRename && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onClick={() => setProjectToRename(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="xenon-panel w-full max-w-sm p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--text)]">Rename Project</h3>
                <button
                  type="button"
                  onClick={() => setProjectToRename(null)}
                  className="text-[var(--muted)] hover:text-[var(--text)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <input
                type="text"
                autoFocus
                className="xenon-input text-xs"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameSubmit();
                }}
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="xenon-btn-ghost px-3 py-1.5 text-xs"
                  onClick={() => setProjectToRename(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="xenon-btn px-4 py-1.5 text-xs"
                  onClick={handleRenameSubmit}
                  disabled={!renameValue.trim()}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Delete Project Confirmation ── */}
      <AnimatePresence>
        {projectToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onClick={() => setProjectToDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="xenon-panel w-full max-w-sm p-6 shadow-2xl space-y-4 border border-[var(--danger)]/30"
            >
              <h3 className="font-bold text-sm text-[var(--danger)]">Delete Project</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <strong className="text-[var(--text)]">{projectToDelete.title}</strong>? This action
                cannot be undone.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="xenon-btn-ghost px-3 py-1.5 text-xs"
                  onClick={() => setProjectToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-xl bg-[var(--danger)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                  onClick={handleDeleteConfirm}
                >
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
