import type { CollectionEntry } from "astro:content";
import React from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import type { SeriesEntry } from "~types/series.type";

interface PostTableProps {
  series: SeriesEntry[];
}

const PostTable: React.FC<PostTableProps> = ({ series }) => {
  const handleRowClick = (seriesId: string) => {
    window.location.href = `/admin/blog/series/edit?id=${seriesId}`;
  };

  return (
    <div className="overflow-hidden rounded-lg border border-skin-line bg-transparent">
      <div className="h-full w-full overflow-x-auto">
        <table className="m-0 h-full w-full min-w-full divide-y divide-skin-line">
          <thead className="bg-skin-fill">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-black-muted">
                이미지
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black-muted">
                제목
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-black-muted">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-skin-line">
            {series.map(series => (
              <tr
                key={series.id}
                onClick={() => handleRowClick(series.id)}
                className="cursor-pointer hover:bg-skin-fill/50"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm text-black-base">
                  <img
                    src={series.data.ogImage}
                    alt={series.data.name}
                    className="h-10 w-10 rounded-full"
                  />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="font-medium text-black-accent">
                    {series.data.name}
                  </span>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/admin/blog/series/edit?id=${series.id}`}
                      className="inline-flex items-center rounded p-1 text-black-muted hover:text-skin-accent"
                      title="수정"
                      onClick={e => e.stopPropagation()}
                    >
                      <FaPen className="text-sm" />
                    </a>
                    <button
                      className="hover:text-danger inline-flex items-center rounded p-1 text-black-muted"
                      title="삭제"
                      onClick={e => {
                        e.stopPropagation();
                        // 삭제 로직 구현
                      }}
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostTable;
