import { MdOutlineModeEdit, MdDelete } from "react-icons/md";
import { IPost } from "../types/postTypes";

interface Props {
  post: IPost;
  isSelected: boolean;
  onSelect: () => void;
  onShowDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ClientPost = ({
  post,
  isSelected,
  onSelect,
  onShowDetails,
  onEdit,
  onDelete, // não se esqueça de desestruturar aqui
}: Props) => {
  return (
    <tr className="hover:bg-gray-50 border-b text-sm group">
      <td className="p-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="cursor-pointer"
        />
      </td>
      <td className="p-2">{post.tipo}</td>
      <td className="p-2">
        <span
          onClick={(e) => {
            e.stopPropagation();
            onShowDetails();
          }}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          {post.username}
        </span>
      </td>
      <td className="p-2">{post.telefone}</td>
      <td className="p-2">{post.email}</td>
      <td className="p-2">
        <span
          className={`inline-block w-3 h-3 rounded-full ${
            post.status === "ativo"
              ? "bg-green-500"
              : post.status === "inativo"
              ? "bg-red-500"
              : "bg-gray-400"
          }`}
        ></span>
      </td>

      <td className="p-2 text-right text-2xl">
        <div className="flex justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-blue-500 hover:text-blue-700"
            title="Editar Cliente"
          >
            <MdOutlineModeEdit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 hover:text-red-700"
            title="Excluir Cliente"
          >
            <MdDelete size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ClientPost;
