import folder from '../'

describe("folder tests", () => {
    it("returns a json file", () => {
        const data = folder.readPackage({path: '/home/divine/Documents/projects/hardocs/hardocs-fs/test-project', force: true})

        console.log(data)
    })

    it("returns true if a hardocs.json file is present in a directory", () => {
        const data = folder.isHardocsProject({path: '/home/divine/Documents/projects/hardocs/hardocs-fs/test-project', force: true})

        console.log(data)
    })
})