"use client";
import React from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface Chapter {
  chapter_id?: number | string;
  chapter_name: string;
  is_preview: number;
  preview_url: string;
}

interface Module {
  module_id?: number | string;
  module_name: string;
  chapters: Chapter[];
}

interface Props {
  value: Module[];
  onChange: (value: Module[]) => void;
}

export default function ModuleChapterEditor({ value = [], onChange }: Props) {
  const addModule = () => {
    onChange([...value, { module_name: "", chapters: [] }]);
  };

  const removeModule = (mIdx: number) => {
    const newModules = [...value];
    newModules.splice(mIdx, 1);
    onChange(newModules);
  };

  const updateModule = (mIdx: number, updates: Partial<Module>) => {
    const newModules = [...value];
    newModules[mIdx] = { ...newModules[mIdx], ...updates };
    onChange(newModules);
  };

  const addChapter = (mIdx: number) => {
    const newModules = [...value];
    newModules[mIdx].chapters.push({
      chapter_name: "",
      is_preview: 0,
      preview_url: ""
    });
    onChange(newModules);
  };

  const updateChapter = (mIdx: number, cIdx: number, updates: Partial<Chapter>) => {
    const newModules = [...value];
    newModules[mIdx].chapters[cIdx] = { ...newModules[mIdx].chapters[cIdx], ...updates };
    onChange(newModules);
  };

  const removeChapter = (mIdx: number, cIdx: number) => {
    const newModules = [...value];
    newModules[mIdx].chapters.splice(cIdx, 1);
    onChange(newModules);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-lg font-medium text-cyan-700">Course Content (Modules & Chapters)</h3>
        <button
          type="button"
          onClick={addModule}
          className="flex items-center gap-1 text-sm bg-cyan-700 text-white px-3 py-1.5 rounded-md hover:bg-cyan-800 transition shadow-sm"
        >
          <Plus size={16} /> Add Module
        </button>
      </div>

      {value.length === 0 && (
        <div className="text-center py-6 text-gray-500 border-2 border-dashed rounded-lg">
          No modules added yet. Add your first module above.
        </div>
      )}

      {value.map((mod, mIdx) => (
        <div key={mIdx} className="bg-gray-50 border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
          <div className="bg-cyan-50/50 p-3 flex items-center gap-3 border-b">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 mt-0.5 flex items-center justify-center font-bold text-sm">
              {mIdx + 1}
            </span>
            <input
              type="text"
              placeholder="Module Name (e.g. Introduction to React)"
              className="flex-grow p-1.5 border rounded focus:ring-1 focus:ring-cyan-500 outline-none text-sm font-semibold"
              value={mod.module_name}
              onChange={(e) => updateModule(mIdx, { module_name: e.target.value })}
            />
            <button
              type="button"
              onClick={() => removeModule(mIdx)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
              title="Remove Module"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="p-4 space-y-3">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chapters</h4>
                <button
                  type="button"
                  onClick={() => addChapter(mIdx)}
                  className="text-xs text-cyan-600 hover:text-cyan-800 flex items-center gap-1 font-semibold"
                >
                  <Plus size={14} /> Add Chapter
                </button>
             </div>

             <div className="space-y-2">
              {mod.chapters.map((chap, cIdx) => (
                <div key={cIdx} className="bg-white p-3 rounded-lg border border-gray-100 flex flex-col gap-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Chapter Name"
                      className="flex-grow p-1.5 border rounded text-xs outline-none focus:border-cyan-500"
                      value={chap.chapter_name}
                      onChange={(e) => updateChapter(mIdx, cIdx, { chapter_name: e.target.value })}
                    />
                    <select
                      className="p-1.5 border rounded text-xs outline-none focus:border-cyan-500 w-28 bg-white"
                      value={chap.is_preview}
                      onChange={(e) => updateChapter(mIdx, cIdx, { is_preview: Number(e.target.value) })}
                    >
                      <option value={0}>Locked</option>
                      <option value={1}>Preview</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeChapter(mIdx, cIdx)}
                      className="p-1.5 text-red-400 hover:text-red-600 transition"
                      title="Remove Chapter"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {chap.is_preview === 1 && (
                    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                      <input
                        type="url"
                        placeholder="Preview URL (Optional)"
                        className="w-full p-1.5 border rounded text-[11px] outline-none italic"
                        value={chap.preview_url}
                        onChange={(e) => updateChapter(mIdx, cIdx, { preview_url: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              ))}
              {mod.chapters.length === 0 && (
                <div className="text-[11px] text-gray-400 italic text-center py-2 bg-gray-100/50 rounded-lg">
                  No chapters yet. Click "Add Chapter" to build this module.
                </div>
              )}
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}
