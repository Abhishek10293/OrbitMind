import React from 'react'
import AssistantsList from './_components/AssistantList'
import Settings from './_components/AssistantSettings'
import ChatUI from './ChatUI'

function Workspace() {
  return (
    <div className='h-screen w-full bg-secondary'>
      <div className='grid grid-cols-8 h-full'>
        {/* Assistants List */}
        <div className='hidden md:block col-span-2 h-full'>
          <AssistantsList />
        </div>

        {/* Chat Area with Border */}
        <div className='col-span-8 md:col-span-6 xl:col-span-4 p-2 h-full'>
          <div className='h-full w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden'>
            <ChatUI />
          </div>
        </div>

        {/* Settings */}
        <div className='hidden xl:block md:col-span-2 h-full'>
          <Settings />
        </div>
      </div>
    </div>
  )
}

export default Workspace
