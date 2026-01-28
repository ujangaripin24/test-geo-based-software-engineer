import Authenticated from "@/Layouts/AuthenticatedLayout"

const RegionPage = () => {
  return (
    <Authenticated
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          RegionPage Dashboard
        </h2>
      }
    >RegionPage</Authenticated>
  )
}

export default RegionPage