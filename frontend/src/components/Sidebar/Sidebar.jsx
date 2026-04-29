import { useState, useEffect } from "react";
import { 
  MessageSquare, ShieldCheck, Plus, FolderPlus, Folder, 
  ChevronRight, ChevronDown, Edit2, Trash2, 
  PanelLeftClose, PanelLeftOpen 
} from "lucide-react";
import { api } from "../../services/api";

export function Sidebar({ brainStatus, onSelectConversation, currentConversationId }) {
  const [groups, setGroups] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [moveMenuId, setMoveMenuId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  async function loadData() {
    try {
      const data = await api.getConversations();
      setGroups(data.groups || []);
      setConversations(data.conversations || []);
    } catch (err) {
      console.error("Erro ao carregar conversas:", err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const toggleGroup = (id) => {
    setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateGroup = async (name = null) => {
    const finalName = name || prompt("Nome do novo grupo:");
    if (finalName) {
      const newGroup = await api.createGroup(finalName);
      loadData();
      return newGroup;
    }
    return null;
  };

  const handleCreateChat = async (groupId = null) => {
    const name = prompt("Nome da nova conversa:");
    if (name) {
      const conv = await api.createConversation(name, groupId);
      loadData();
      onSelectConversation(conv.id);
    }
  };

  const handleRename = async (id, type, currentName) => {
    setEditingId(id);
    setEditValue(currentName);
  };

  const submitRename = async (id, type) => {
    if (!editValue.trim()) return setEditingId(null);
    if (type === 'group') {
      await api.updateGroup(id, editValue);
    } else {
      await api.updateConversation(id, { name: editValue });
    }
    setEditingId(null);
    loadData();
  };

  const handleDelete = async (id, type) => {
    if (confirm(`Tem certeza que deseja excluir este ${type === 'group' ? 'grupo' : 'conversa'}?`)) {
      if (type === 'group') {
        await api.deleteGroup(id);
      } else {
        await api.deleteConversation(id);
      }
      loadData();
    }
  };

  const handleMoveToGroup = async (convId, groupId) => {
    await api.updateConversation(convId, { groupId });
    setMoveMenuId(null);
    loadData();
  };

  const handleCreateAndMove = async (convId) => {
    const name = prompt("Nome do novo grupo:");
    if (name) {
      const newGroup = await api.createGroup(name);
      await api.updateConversation(convId, { groupId: newGroup.id });
      setMoveMenuId(null);
      loadData();
    }
  };

  const renderMoveMenu = (conv) => {
    if (moveMenuId !== conv.id) return null;

    return (
      <div className="move-menu" onClick={(e) => e.stopPropagation()}>
        <div className="move-menu-header">Mover para:</div>
        <div className="move-menu-item" onClick={() => handleMoveToGroup(conv.id, null)}>
          <Folder size={12} /> Sem grupo
        </div>
        {groups.map(group => (
          <div key={group.id} className="move-menu-item" onClick={() => handleMoveToGroup(conv.id, group.id)}>
            <Folder size={12} /> {group.name}
          </div>
        ))}
        <div className="move-menu-divider" />
        <div className="move-menu-item create-option" onClick={() => handleCreateAndMove(conv.id)}>
          <FolderPlus size={12} /> Criar novo grupo e mover
        </div>
      </div>
    );
  };

  const renderConversations = (groupId) => {
    return conversations
      .filter(c => c.groupId === groupId)
      .map(conv => (
        <div 
          key={conv.id} 
          className={`sidebar-item conversation-item ${currentConversationId === conv.id ? 'active' : ''}`}
          onClick={() => onSelectConversation(conv.id)}
          title={isCollapsed ? conv.name : ""}
        >
          <MessageSquare size={14} />
          {!isCollapsed && (
            <>
              {editingId === conv.id ? (
                <input 
                  autoFocus
                  className="edit-input"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => submitRename(conv.id, 'conversation')}
                  onKeyDown={e => e.key === 'Enter' && submitRename(conv.id, 'conversation')}
                />
              ) : (
                <span className="item-name">{conv.name}</span>
              )}
              <div className="item-actions">
                <div className="action-wrapper">
                  <Folder size={12} title="Mover para grupo" onClick={(e) => { e.stopPropagation(); setMoveMenuId(moveMenuId === conv.id ? null : conv.id); }} />
                  {renderMoveMenu(conv)}
                </div>
                <Edit2 size={12} onClick={(e) => { e.stopPropagation(); handleRename(conv.id, 'conversation', conv.name); }} />
                <Trash2 size={12} onClick={(e) => { e.stopPropagation(); handleDelete(conv.id, 'conversation'); }} />
              </div>
            </>
          )}
        </div>
      ));
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <ShieldCheck size={24} color="#10a37f" />
          {!isCollapsed && <span>Agente Contabil</span>}
        </div>
        <button className="toggle-sidebar" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      <div className="sidebar-actions">
        <button className="action-btn" onClick={() => handleCreateChat()} title="Novo Chat">
          <Plus size={16} /> {!isCollapsed && "Novo Chat"}
        </button>
        <button className="action-btn secondary" onClick={() => handleCreateGroup()} title="Novo Grupo">
          <FolderPlus size={16} /> {!isCollapsed && "Novo Grupo"}
        </button>
      </div>

      <div className="sidebar-scroll">
        <div className="sidebar-section">
          {!isCollapsed && <span className="section-title">Grupos</span>}
          {groups.map(group => (
            <div key={group.id} className="group-container">
              <div className="sidebar-item group-header" onClick={() => toggleGroup(group.id)} title={isCollapsed ? group.name : ""}>
                {expandedGroups[group.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <Folder size={14} />
                {!isCollapsed && (
                  <>
                    {editingId === group.id ? (
                      <input 
                        autoFocus
                        className="edit-input"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={() => submitRename(group.id, 'group')}
                        onKeyDown={e => e.key === 'Enter' && submitRename(group.id, 'group')}
                      />
                    ) : (
                      <span className="item-name">{group.name}</span>
                    )}
                    <div className="item-actions">
                      <Plus size={12} title="Nova conversa no grupo" onClick={(e) => { e.stopPropagation(); handleCreateChat(group.id); }} />
                      <Edit2 size={12} onClick={(e) => { e.stopPropagation(); handleRename(group.id, 'group', group.name); }} />
                      <Trash2 size={12} onClick={(e) => { e.stopPropagation(); handleDelete(group.id, 'group'); }} />
                    </div>
                  </>
                )}
              </div>
              {!isCollapsed && expandedGroups[group.id] && (
                <div className="group-content">
                  {renderConversations(group.id)}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="sidebar-section">
          {!isCollapsed && <span className="section-title">Conversas</span>}
          {renderConversations(null)}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="status-row">
          <span>Memorias ativas</span>
          <strong>{brainStatus?.activeMemoriesCount ?? 0}</strong>
        </div>
      </div>
    </aside>
  );
}
