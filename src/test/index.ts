import { join } from "path"
import { Loader } from ".."

const paths = Loader.loadDirectory(join(__dirname, "../objects"), ["ts"])

paths.then(async (loads) => {
  const a = await import(loads[0])
  console.log(a)
})
