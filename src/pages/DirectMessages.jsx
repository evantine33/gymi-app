import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { Send, ArrowLeft, MessageCircle } from 'lucide-react'

function formatTime(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function Conversation({ partner, onBack }) {
  const { state, dispatch, currentUser } = useApp()
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  const messages = state.directMessages.filter(
    dm =>
      (dm.fromId === currentUser.id && dm.toId === partner.id) ||
      (dm.fromId === partner.id && dm.toId === currentUser.id)
  )

  useEffect(() => {
    dispatch({ type: 'MARK_DMS_READ', fromId: partner.id })
  }, [partner.id, messages.length])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    dispatch({ type: 'SEND_DM', toId: partner.id, text: text.trim() })
    setText('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 flex-shrink-0 border-b border-gray-800">
        <button onClick={onBack} className="text-gray-400 hover:text-white md:hidden">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-orange-400">
          {partner.initials}
        </div>
        <div>
          <p className="font-semibold">{partner.name}</p>
          <p className="text-xs text-gray-500">{partner.role === 'coach' ? 'Coach' : 'Member'}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="w-10 h-10 text-gray-700 mb-3" />
            <p className="text-gray-500 text-sm">No messages yet</p>
            <p className="text-gray-600 text-xs mt-1">Send a message to start the conversation</p>
          </div>
        )}
        {messages.map(dm => {
          const isMe = dm.fromId === currentUser.id
          return (
            <div key={dm.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-orange-500 text-white rounded-tr-sm'
                      : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700'
                  }`}
                >
                  {dm.text}
                </div>
                <span className="text-xs text-gray-600 mt-1">{formatTime(dm.timestamp)}</span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-gray-800">
        <form onSubmit={send} className="flex gap-2">
          <input
            className="input flex-1"
            placeholder={`Message ${partner.name.split(' ')[0]}...`}
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button type="submit" disabled={!text.trim()} className="btn-primary px-4">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default function DirectMessages() {
  const { state, currentUser } = useApp()
  const [selected, setSelected] = useState(null)

  // Only show people in the same gym
  const contacts = state.users.filter(u => u.id !== currentUser.id && u.gymId === currentUser.gymId)

  const getLastMessage = (userId) => {
    const msgs = state.directMessages.filter(
      dm =>
        (dm.fromId === currentUser.id && dm.toId === userId) ||
        (dm.fromId === userId && dm.toId === currentUser.id)
    )
    return msgs[msgs.length - 1] || null
  }

  const getUnread = (userId) =>
    state.directMessages.filter(
      dm => dm.fromId === userId && dm.toId === currentUser.id && !dm.read
    ).length

  if (selected) {
    const partner = state.users.find(u => u.id === selected)
    return (
      <div className="max-w-2xl mx-auto">
        <Conversation partner={partner} onBack={() => setSelected(null)} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-gray-400 text-sm mt-0.5">Direct messages with your gym family</p>
      </div>

      <div className="card divide-y divide-gray-800 p-0 overflow-hidden">
        {contacts.map(contact => {
          const last = getLastMessage(contact.id)
          const unread = getUnread(contact.id)
          return (
            <button
              key={contact.id}
              onClick={() => setSelected(contact.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-gray-800/50 transition-colors text-left"
            >
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-gray-700 flex items-center justify-center font-bold text-orange-400">
                  {contact.initials}
                </div>
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                    {unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className={`font-semibold truncate ${unread > 0 ? 'text-white' : 'text-gray-300'}`}>
                    {contact.name}
                  </p>
                  {last && (
                    <span className="text-xs text-gray-600 flex-shrink-0">
                      {formatTime(last.timestamp)}
                    </span>
                  )}
                </div>
                <p className={`text-sm truncate mt-0.5 ${unread > 0 ? 'text-gray-300' : 'text-gray-500'}`}>
                  {last
                    ? `${last.fromId === currentUser.id ? 'You: ' : ''}${last.text}`
                    : contact.role === 'coach' ? 'Your coach' : 'Member'}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
