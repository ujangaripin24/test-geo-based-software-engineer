import Authenticated from '@/Layouts/AuthenticatedLayout'
import React from 'react'

const OrganizationsPage: React.FC = () => {
  return (
    <Authenticated
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          OrganizationsPage Dashboard
        </h2>
      }
    >OrganizationsPage</Authenticated>
  )
}

export default OrganizationsPage