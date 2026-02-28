import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import {
  PaperClipIcon,
  FaceSmileIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  PhotoIcon,
  DocumentIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  InformationCircleIcon,
  UserGroupIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import {
  PaperAirplaneIcon as PaperAirplaneSolid,
  CheckIcon as CheckSolid,
} from '@heroicons/react/24/solid';
import { Avatar } from '@/components/shared';

/* ── Initial Data ──────────────────────────────────── */
const ALL_CONTACTS = [];

const MESSAGES_DB = {};

const EMOJI_LIST = ['\u{1F600}', '\u{1F602}', '\u{2764}\u{FE0F}', '\u{1F44D}', '\u{1F389}', '\u{1F525}', '\u{1F4AF}', '\u{2705}', '\u{2B50}', '\u{1F680}', '\u{1F4AA}', '\u{1F64C}', '\u{1F44F}', '\u{1F91D}', '\u{1F4A1}', '\u{1F4CE}'];

const roleColors = {
  Recruiter: 'text-purple-600 bg-purple-50',
  Freelancer: 'text-blue-600 bg-blue-50',
  'Campus Admin': 'text-emerald-600 bg-emerald-50',
  Admin: 'text-rose-600 bg-rose-50',
  Group: 'text-amber-600 bg-amber-50',
};

export default function ChatPage() {
  const [contacts, setContacts] = useState(ALL_CONTACTS);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState(MESSAGES_DB);
  const [text, setText] = useState('');
  const [searchContacts, setSearchContacts] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [mobileSidebar, setMobileSidebar] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeContact, messages]);

  const filteredContacts = contacts.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchContacts.toLowerCase());
    const matchRole = filterRole === 'All' || c.role === filterRole;
    return matchSearch && matchRole;
  });

  const activeMessages = messages[activeContact?.id] || [];

  const handleSend = (e) => {
    e.preventDefault();
    if (!activeContact) return;
    if (!text.trim() && attachments.length === 0) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      from: 'me',
      text: text.trim() || null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mine: true,
      read: false,
      ...(attachments.length > 0 && { attachment: { name: attachments[0].name, size: `${(attachments[0].size / 1024).toFixed(1)} KB`, type: attachments[0].name.split('.').pop() } }),
    };
    setMessages((prev) => ({ ...prev, [activeContact.id]: [...(prev[activeContact.id] || []), newMsg] }));
    setText('');
    setAttachments([]);
    setShowEmoji(false);
  };

  const handleContactClick = (c) => {
    setActiveContact(c);
    setMobileSidebar(false);
    setContacts((prev) => prev.map((ct) => ct.id === c.id ? { ...ct, unread: 0 } : ct));
  };

  const handleFileSelect = (e) => {
    setAttachments(Array.from(e.target.files));
    setShowAttachMenu(false);
  };

  const totalUnread = contacts.reduce((sum, c) => sum + c.unread, 0);
  const roles = ['All', 'Recruiter', 'Freelancer', 'Campus Admin', 'Admin', 'Group'];

  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-2xl overflow-hidden ring-1 ring-gray-200 bg-white shadow-sm">
      {/* ── Sidebar ──────────────────────────────── */}
      <div className={clsx('w-full sm:w-80 border-r border-gray-200 flex flex-col bg-white shrink-0', mobileSidebar ? 'flex' : 'hidden sm:flex')}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">Messages</h2>
              {totalUnread > 0 && (
                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] font-bold text-white">{totalUnread}</span>
              )}
            </div>
            <button className="rounded-lg p-2 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" value={searchContacts} onChange={(e) => setSearchContacts(e.target.value)} placeholder="Search conversations..." className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
          </div>
          <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
            {roles.map((r) => (
              <button key={r} onClick={() => setFilterRole(r)} className={clsx('rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-all', filterRole === r ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
              <MagnifyingGlassIcon className="h-8 w-8 mb-2" />
              No conversations found
            </div>
          ) : filteredContacts.map((c) => (
            <button key={c.id} onClick={() => handleContactClick(c)} className={clsx('w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all duration-200', activeContact?.id === c.id ? 'bg-indigo-50/70 border-r-[3px] border-indigo-500' : 'hover:bg-gray-50')}>
              <div className="relative">
                {c.group ? (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <UserGroupIcon className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <Avatar name={c.name} size="sm" status={c.online ? 'online' : 'offline'} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                  <span className="text-[11px] text-gray-400 shrink-0 ml-2">{c.time}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={clsx('rounded-full px-1.5 py-0.5 text-[10px] font-medium', roleColors[c.role] || 'text-gray-500 bg-gray-100')}>{c.role}</span>
                  <span className="text-[10px] text-gray-400">&bull; {c.campus}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {c.typing ? (
                    <span className="text-indigo-500 font-medium flex items-center gap-1">
                      <span className="flex gap-0.5">
                        <span className="h-1 w-1 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1 w-1 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1 w-1 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                      typing...
                    </span>
                  ) : c.lastMsg}
                </p>
              </div>
              {c.unread > 0 && (
                <span className="mt-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] font-bold text-white shrink-0">{c.unread}</span>
              )}
            </button>
          ))}
        </div>

        <div className="border-t border-gray-100 px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex h-2 w-2 rounded-full bg-green-500" />
            {contacts.filter((c) => c.online).length} online now
          </div>
        </div>
      </div>

      {/* ── Chat Area ────────────────────────────── */}
      <div className={clsx('flex-1 flex flex-col', mobileSidebar ? 'hidden sm:flex' : 'flex')}>
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <button onClick={() => setMobileSidebar(true)} className="sm:hidden rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {activeContact.group ? (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <UserGroupIcon className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <Avatar name={activeContact.name} size="sm" status={activeContact.online ? 'online' : 'offline'} />
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">{activeContact.name}</p>
                  <p className="text-xs text-gray-500">
                    {activeContact.group
                      ? `${activeContact.members?.length || 0} members`
                      : activeContact.online
                        ? <span className="text-green-500 font-medium">Online</span>
                        : `${activeContact.role} \u2022 ${activeContact.campus}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!activeContact.group && (
                  <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"><PhoneIcon className="h-4 w-4" /></button>
                )}
                <button onClick={() => setShowInfo(!showInfo)} className={clsx('rounded-lg p-2 transition-colors', showInfo ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600')}>
                  <InformationCircleIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-gradient-to-b from-gray-50/80 to-white">
                  <div className="text-center">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">Today</span>
                  </div>
                  {activeMessages.map((msg) => (
                    <div key={msg.id} className={clsx('flex', msg.mine ? 'justify-end' : 'justify-start')}>
                      <div className="flex items-end gap-2 max-w-[75%]">
                        {!msg.mine && <Avatar name={msg.from} size="xs" />}
                        <div className={clsx('rounded-2xl px-4 py-2.5 text-sm shadow-sm', msg.mine ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-md' : 'bg-white text-gray-800 ring-1 ring-gray-100 rounded-bl-md')}>
                          {!msg.mine && activeContact.group && <p className="text-[11px] font-semibold text-indigo-500 mb-1">{msg.from}</p>}
                          {msg.attachment && (
                            <div className={clsx('flex items-center gap-2 rounded-lg p-2 mb-2', msg.mine ? 'bg-white/20' : 'bg-gray-50')}>
                              <div className={clsx('h-8 w-8 rounded-lg flex items-center justify-center', msg.mine ? 'bg-white/30' : 'bg-indigo-100')}>
                                <DocumentIcon className={clsx('h-4 w-4', msg.mine ? 'text-white' : 'text-indigo-600')} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={clsx('text-xs font-medium truncate', msg.mine ? 'text-white' : 'text-gray-900')}>{msg.attachment.name}</p>
                                <p className={clsx('text-[10px]', msg.mine ? 'text-indigo-200' : 'text-gray-400')}>{msg.attachment.size}</p>
                              </div>
                              <button className={clsx('rounded-lg p-1', msg.mine ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-gray-600')}>
                                <ArrowDownTrayIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                          {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                          <div className={clsx('flex items-center gap-1 mt-1', msg.mine ? 'justify-end' : '')}>
                            <p className={clsx('text-[10px]', msg.mine ? 'text-indigo-200' : 'text-gray-400')}>{msg.time}</p>
                            {msg.mine && (
                              <span className="text-[10px]">
                                {msg.read ? (
                                  <span className="text-indigo-200 flex"><CheckSolid className="h-3 w-3" /><CheckSolid className="h-3 w-3 -ml-1.5" /></span>
                                ) : (
                                  <CheckSolid className="h-3 w-3 text-indigo-300" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {activeContact.typing && (
                    <div className="flex justify-start">
                      <div className="flex items-end gap-2">
                        <Avatar name={activeContact.name} size="xs" />
                        <div className="bg-white ring-1 ring-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                          <div className="flex gap-1">
                            <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {attachments.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-2">
                    <div className="flex items-center gap-2">
                      {attachments.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-lg bg-white ring-1 ring-gray-200 px-3 py-2">
                          <DocumentIcon className="h-4 w-4 text-indigo-500" />
                          <span className="text-xs text-gray-700 max-w-[120px] truncate">{f.name}</span>
                          <button onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500"><XMarkIcon className="h-3.5 w-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-100 bg-white px-4 sm:px-6 py-3">
                  <form onSubmit={handleSend} className="flex items-end gap-2">
                    <div className="relative">
                      <button type="button" onClick={() => setShowAttachMenu(!showAttachMenu)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"><PaperClipIcon className="h-5 w-5" /></button>
                      {showAttachMenu && (
                        <div className="absolute bottom-12 left-0 z-10 rounded-xl bg-white shadow-lg ring-1 ring-gray-200 p-2 min-w-[160px]">
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"><DocumentIcon className="h-4 w-4 text-blue-500" /> Document</button>
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"><PhotoIcon className="h-4 w-4 text-green-500" /> Photo / Image</button>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
                    </div>
                    <div className="flex-1">
                      <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }} placeholder="Type a message..." rows={1} className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 max-h-32" />
                    </div>
                    <div className="relative">
                      <button type="button" onClick={() => setShowEmoji(!showEmoji)} className={clsx('rounded-lg p-2 transition-colors', showEmoji ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600')}><FaceSmileIcon className="h-5 w-5" /></button>
                      {showEmoji && (
                        <div className="absolute bottom-12 right-0 z-10 rounded-xl bg-white shadow-lg ring-1 ring-gray-200 p-3 grid grid-cols-8 gap-1.5 w-[240px]">
                          {EMOJI_LIST.map((em) => (
                            <button key={em} type="button" onClick={() => { setText((prev) => prev + em); setShowEmoji(false); }} className="text-lg hover:bg-gray-100 rounded-lg p-1 transition-transform hover:scale-125">{em}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button type="submit" disabled={!text.trim() && attachments.length === 0} className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-2.5 text-white shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                      <PaperAirplaneSolid className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Info Panel */}
              {showInfo && (
                <div className="hidden md:flex w-72 flex-col border-l border-gray-100 bg-white overflow-y-auto">
                  <div className="p-6 text-center border-b border-gray-100">
                    {activeContact.group ? (
                      <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3">
                        <UserGroupIcon className="h-8 w-8 text-white" />
                      </div>
                    ) : (
                      <div className="mx-auto mb-3"><Avatar name={activeContact.name} size="lg" status={activeContact.online ? 'online' : 'offline'} /></div>
                    )}
                    <p className="text-sm font-bold text-gray-900">{activeContact.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{activeContact.role} &bull; {activeContact.campus}</p>
                    {activeContact.online && !activeContact.group && (
                      <span className="inline-flex items-center gap-1 mt-2 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Active now</span>
                    )}
                  </div>
                  {activeContact.group && activeContact.members && (
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Members ({activeContact.members.length})</p>
                      <div className="space-y-2">
                        {activeContact.members.map((m) => (
                          <div key={m} className="flex items-center gap-2"><Avatar name={m} size="xs" /><p className="text-sm text-gray-700">{m}</p></div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Shared Files</p>
                    {activeMessages.filter((m) => m.attachment).length > 0 ? (
                      <div className="space-y-2">
                        {activeMessages.filter((m) => m.attachment).map((m) => (
                          <div key={m.id} className="flex items-center gap-2 rounded-lg bg-gray-50 p-2">
                            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center"><DocumentIcon className="h-4 w-4 text-indigo-600" /></div>
                            <div className="flex-1 min-w-0"><p className="text-xs font-medium text-gray-900 truncate">{m.attachment.name}</p><p className="text-[10px] text-gray-400">{m.attachment.size}</p></div>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-xs text-gray-400">No files shared yet</p>}
                  </div>
                  <div className="p-4 border-t border-gray-100 mt-auto">
                    <button className="w-full rounded-xl bg-gray-50 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors mb-2">Mute Notifications</button>
                    <button className="w-full rounded-xl bg-red-50 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors">Block Contact</button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Select a conversation to start messaging</div>
        )}
      </div>
    </div>
  );
}
