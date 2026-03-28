import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { Send } from 'lucide-react'

function formatTime(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function Community() {
  const { state, dispatch, currentUser } = useApp()
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.communityMessages])

  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    dispatch({ type: 'SEND_COMMUNITY_MSG', text: text.trim() })
    setText('')
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="px-4 pt-6 pb-3 flex-shrink-0">
        <h1 className="text-2xl font-bold">Community</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {state.users.filter(u => u.role === 'member').length} members · Open channel
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-3">
        {state.communityMessages.map((msg, i) => {
          const isMe = msg.userId === currentUser.id
          const prevMsg = state.communityMessages[i - 1]
          const showHeader = !prevMsg || prevMsg.userId !== msg.userId

          return (
            <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              {!isMe && (
                <div className={`flex-shrink-0 ${showHeader ? 'visible' : 'invisible'}`}>
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-orange-400">
                    {msg.initials}
                  </div>
                </div>
              )}

              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                {showHeader && !isMe && (
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-300">{msg.userName}</span>
                    <span className="text-xs text-gray-600">{formatTime(msg.timestamp)}</span>
                  </div>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-orange-500 text-white rounded-tr-sm'
                      : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700'
                  }`}
                >
                  {msg.text}
                </div>
                {isMe && (
                  <span className="text-xs text-gray-600 mt-1">{formatTime(msg.timestamp)}</span>
                )}
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
            placeholder="Send a message to the team..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="btn-primary px-4 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
