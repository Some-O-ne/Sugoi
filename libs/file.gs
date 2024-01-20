
path = {}
path.isValidPath = function(path)
    if not @path isa string then return false
    if not checks.isPathAlphaNumeric(@path) then return false
    return true
end function
path.isAbsolute = function(path)
    if not self.isValidPath(@path) then return false
    return path[0] == "/"
end function
path.isRelative = function(path)
    if not self.isValidPath(@path) then return false
    return path[0] != "/"
end function


fileHandler = function(object,path)
	fileHandler = {}

	fileHandler.init = function(object, path)
		if typeof(@object) == "shell" then
			self.__file = object.host_computer.File("/")
		else if typeof(@object) == "computer" then
			self.__file = object.File("/")
		else if typeof(@object) == "file" then
			self.__file = object

			while self.__file.parent
				self.__file = self.__file.parent
			end while
		end if

		fileExists = false
		if path then
			fileExists = self.changeDir(path)
		else
			fileExists = self.__file isa file
		end if
		return fileExists
	end function

	fileHandler.changeDir = function(path)
		if not globals.path.isValidPath(@path) then return null
		return self.resolvePath(path)
	end function
	fileHandler.resolvePath = function(path)
		if globals.path.isAbsolute(@path) then
			while self.__file.parent
				self.__file = self.__file.parent
			end while
		end if
		for folder in path.split("/").removeAll("")
			if not folder then continue
			if folder == "." then continue
			if folder == ".." then
				if self.__file.parent then self.__file = self.__file.parent
				continue
			end if
			found = false
			for f in self.__file.get_folders + self.__file.get_files
				if folder == f.name then
					self.__file = f
					found = true
					break
				end if
			end for
			if not found then return false
		end for
		return true
	end function

	fileHandler.getDir = function()
		return self.__file.path
	end function

	fileHandler.getFile = function()
		return self.__file
	end function
	fileHandler.isFolder = function
		return self.__file.is_folder
	end function
	fileHandler.name = function
		return self.__file.name
	end function
	fileHandler.getContents = function
		if not self.isFolder then return null
		return self.__file.get_folders+self.__file.get_files
	end function
	if not fileHandler.init(object,path) then return null
	return fileHandler
end function
