lib = {}
lib.version = "1.0.0"
lib.obj = null
lib.name = ""

libs = {"__libs":[]}
libs.addLib = function(lib)
    if not lib isa globals.lib then return false
    self.__libs.push(lib)
end function
libs.delLib = function(name)
    self.__libs.remove(name)
end function
libs.getLib = function(name)
    if not self.__libs.hasIndex(name) then return null
    return self[name]
end function


