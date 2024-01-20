import_code("sessions.gs")
import_code("file.gs")
import_code("logger.gs")
command = {"args": [], "__run": null, "supportedObjects": []}

command.execute = function(args)
	
	if not self.args then
		return self.__run
	end if
	return self.__run(args)
end function

commandsController = {"__commands": {}}

commandsController.tryExecute = function(name, args)
	
	if not self.__commands.hasIndex(name) then
		return logger.log("Command doesn't exist", 1)
	end if
	
	if self.__commands[name].supportedObjects.indexOf(typeof(sessions.getCurrentSession.object)) == -1 then
		return logger.log("Can't execute this command in " + typeof(sessions.getCurrentSession.object))
	end if
	fulfilledArgs = []
	args.fillUntil(self.__commands[name].args.len, "")

	for arg in self.__commands[name].args
		argCorrect = ArgsValidator.val(args[__arg_idx], arg.name)
		
		if arg.hasIndex("options") then
			argCorrect = arg.options.indexOf(args[__arg_idx]) != -1
		end if

		if argCorrect then
			fulfilledArgs.push(args[__arg_idx])
			continue
		else
			if arg.hasIndex("default") then
				fulfilledArgs.push(arg.default)
			else
				options = []

				for option in arg.name
					options.push(ArgsValidator[option])
				end for

				
				if arg.hasIndex("options") then
					options = arg.options
				end if
				displayName = arg.name
				if arg.hasIndex("displayName") then displayName = arg.displayName
				_ = cgui.question(name + ": arg " + __arg_idx, options, displayName, false, theme.warning)
				if not _ then return
				fulfilledArgs.push(_)
			end if

		end if

	end for

	return self.__commands[name].execute(fulfilledArgs)
end function

commandsController.register = function(command, name)
	self.__commands[name] = command
	
	if globals.indexOf(command) != -1 then
		globals.remove(globals.indexOf(command))
	end if
end function
commandsController.delete = function(name)
	if self.__commands.hasIndex(name) then self.__commands.remove(name)
end function
commandsController.tryExecuteString = function(str)
	
	if not @str isa string or str.len < 1 then
		return false
	end if
	return self.tryExecute(str.split(" ")[0], str.split(" ")[1 : ])
end function

commandsController.tryExecuteFile = function(fileHandler)
	
	if not fileHandler or not fileHandler.getFile.get_content then
		return false
	end if

	for line in fileHandler.getFile.get_content.split(char(10))
		
		if not self.commandsController.tryExecuteString(line) then
			return false
		end if
	end for
end function

ArgsValidator = {}
ArgsValidator["ip"] = "^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$"
ArgsValidator["partialIP"] = "^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){0,2}$"
ArgsValidator["path"] = "^\/{0,1}([A-z0-9.]+\/{0,1})*"
// yay it works
ArgsValidator["name"] = "^[A-z]+"
ArgsValidator["number"] = "^[0-9]+"
ArgsValidator["filename"] = "^[A-z0-9]+.{0,1}[A-z0-9]*"
ArgsValidator["any"] = "^.*"
ArgsValidator.val = function(arg = "", names = [""])
	
	if not self.hasIndexes(names) then
		return false
	end if
	for name in names
		if not arg.matchesplus(self[name]) then return false
	end for

	return true
end function

ex = new command
// its not particularly "sugoi" (awesome, good in japanese), so the alternative name is 悪い
ex.description = "Exits Sugoi!"
ex.args = []
ex.supportedObjects = ["shell", "computer", "file", "ftpshell"]
ex.__run = @exit
commandsController.register(ex, "exit")
cd = new command
cd.args = [{"name": ["path"]}]
cd.description = "Switches current session's working folder"
cd.supportedObjects = ["shell", "computer", "file", "ftpshell"]

cd.__run = function(args)
	path = args[0]
	s = sessions.getCurrentSession
	file = new fileHandler(s.object, s.dir)

	if not file.changeDir(path) then
		return logger.log(path + " doesn't exist", 1)
	end if

	sessions.__sessions[sessions.current].dir = file.getDir
	return true
end function

commandsController.register(cd, "cd")
ls = new command
ls.args = [{"name": ["path"], "default": "."},{"name":["name"],"displayName":"-recursive","options":["r"],"default":""}]
ls.description = "Show contents of current folder"
ls.supportedObjects = ["shell", "computer", "file", "ftpshell"]

ls.__run = function(args)
	path = args[0]
	recursive = args[1]
	s = sessions.getCurrentSession
	file = new fileHandler(s.object, s.dir)
	
	if not file.changeDir(path) then
		return logger.log(path + " doesn't exist", 1)
	end if
	traverse = function(file, recursive)
		text = ""
		if not file.is_folder then
			content = [file]
		else
			content = file.get_files+file.get_folders
		end if


		for file in content
			
			if file.is_folder and recursive then 
				text = text +  ("\n"*((file.get_files+file.get_folders) != []))
			end if

			padding = " "
			color = theme.warning
			
			if file.has_permission("r") and file.has_permission("w") then
				color = theme.success
			end if
			text = text + "<space="+5*file.path[1:].split("/").len-1+"px>" // basically if file.path = "/home/a" then "/home/a" -> "home/a" -> ["home","a"] -> 2 -> 1 and " "*1 = " "
			text = text + file.permissions.color(theme.base) + " "
			_ = ("r" * file.has_permission("r") + "w" * file.has_permission("w") + "x" * file.has_permission("x"))

			if not _ then
				text = text + "no".color(theme.error) + "  "
			else
				text = text + _.color(color) + "  "
			end if

			text = text + file.size.color(theme.highlightA) + "  "
			text = text + file.owner.color(theme.highlightB) + "  "
			text = text + file.group.color(theme.highlightB) + "  "
			text = text + file.name.color(theme.light)
			text = text + "\n"

			
			if file.is_folder and recursive then text = text + traverse(file, 1)
		end for
		return text
	end function
	print format_columns(traverse(file.getFile,recursive))
end function
commandsController.register(ls, "ls")

fs = new command
fs.args = []
fs.supportedObjects = ["shell","computer","ftpshell","file"]
fs.description = "View whole filesystem"
fs.__run = function
	commandsController.tryExecuteString("ls / r")
end function
commandsController.register(fs, "fs")



touch = new command
touch.args = [{"name": ["filename"]}]
touch.supportedObjects = ["shell", "computer", "ftpshell"]
touch.description = "Creates a file"

touch.__run = function(args)
	s = sessions.getCurrentSession
	computer = null
	
	if s.object.hasIndex("host_computer") then
		computer = s.object.host_computer
	end if
	
	if not computer then
		computer = s.object
	end if
	error = computer.touch(s.dir, args[0])
	
	if error isa string then
		return logger.log(error, 2)
	end if
end function

commandsController.register(touch, "touch")
alias = new command
alias.args = [{"name": ["name"], "displayName": "commandName"}, {"name": ["name"], "displayName": "newName"}]

alias.description = "Add a new [name] for a [command]"

alias.__run = function(args)
	command = args[0]
	name = args[1]
	
	if not commandsController.__commands.hasIndex(command) then
		return logger.log("Command doesn't exist", 1)
	end if
	commandsController.register(@commandsController.__commands[command], name)
end function

commandsController.register(alias, "alias")

echo = new command
echo.description = "Print some text"
echo.args = [{"name":["any"],"displayName":"text"}]
echo.supportedObjects = ["shell", "computer", "file", "ftpshell"]
echo.__run = function(args)
	print(args[0])	
end function
commandsController.register(echo,"echo")

cat = new command
cat.description = "Views a file"
cat.args = [{"name": ["filename"]}]
cat.supportedObjects = ["shell", "computer", "file", "ftpshell"]

cat.__run = function(args)
	s = sessions.getCurrentSession
	filename = args[0]
	file = new fileHandler(s.object, s.dir)

	if not file.changeDir(filename) then
		return logger.log(filename + " doesn't exist", 1)
	end if

	if file.isFolder then
		return logger.log(filename + " is a folder", 1)
	end if

	if file.getFile.is_binary then
		return logger.log(filename + " is a binary", 1)
	end if

	if not file.getFile.has_permission("r") then
		return logger.log("No permission to read " + filename, 2)
	end if

	print(file.getFile.get_content.color(theme.highlightA))
end function
commandsController.register(cat, "cat")

delcmd = new command
delcmd.args = [{"name":["name"],"displayName":"commandName"}]
delcmd.description = "Deletes a command"
delcmd.__run = function(args)
	if not commandsController.__commands.hasIndex(args[0]) then return logger.log("Command doesn't exist",1)
	commandsController.delete(args[0])	
end function
commandsController.register(delcmd,"delcmd")

// todo - full filesytem print
// todo - exploit scan


nmap = new command
nmap.description = "Scans ports on a ip"
nmap.args = [{"name": ["ip"]}]

nmap.__run = function(args)
	ip = args[0]

	if not is_valid_ip(ip) then
		return logger.log(ip + " is not a valid ip", 2)
	end if

	if is_lan_ip(ip) then
		router = get_router
	else
		router = get_router(ip)
	end if

	if not router then
		return logger.log("Couldn't get router", 2)
	end if

	if not is_lan_ip(ip) then
		ports = router.used_ports
	else
		ports = router.device_ports(ip)
	end if

	if not ports then
		return logger.log("IP not found", 2)
	end if

	text = ""
	//ports.push({"classID":{}})

	for lan in router.devices_lan_ip
		ports = ports + router.device_ports(lan)
	end for

	for port in ports
		if port.is_closed then
			_ = "closed".color(theme.error)
		else
			_ = "open".color(theme.success)
		end if
		text = text + str(port.port_number).color(theme.base) + " " + _ + " " + router.port_info(port).color(theme.highlightA) + " " + port.get_lan_ip.color(theme.light) + "\n"
	end for

	print(("ESSID: " + router.essid_name).color(theme.highlightA))
	print(("BSSID: " + router.bssid_name).color(theme.highlightB))

	print(format_columns(text))

end function

commandsController.register(nmap, "nmap")


chobj = new command
chobj.args = []
chobj.description = "Change current session"
chobj.__run = function(args)
	sessions.setCurrentSession(cgui.list(sessions.__sessions))
end function
commandsController.register(chobj,"chobj")


help = new command
help.description = "Help on commands"
help.args = []

help.__run = function(args)
	text = ""

	for entry in commandsController.__commands
		text = text + entry.key.color(theme.highlightA) + " "

		for arg in entry.value.args
			wrap = ["[", "]"]
			
			if arg.hasIndex("default") then
				wrap = ["(", ")"]
			end if
			name = arg.name.join("|")
			
			if arg.hasIndex("displayName") then
				name = arg.displayName
			end if
			
			if arg.hasIndex("options") then
				name = name + ": " + arg.options.join("|")
			end if
			text = text + wrap.join(name).color(theme.highlightB) + " "

			// if not arg.hasIndex("default") and not arg.hasIndex("options") then text = text + ("[" + arg.name + "] ").color(theme.highlightB)

			// if arg.hasIndex("default") and not arg.hasIndex("options") then text = text + ("(" + arg.name + ") ").color(theme.highlightB)

			// if arg.hasIndex("options") and not arg.hasIndex("default") then text = text + ("(" + arg.options.join("|") + ") ")

		end for

		text = text + " - ".color(theme.base)
		if not entry.value.hasIndex("description") then
			text = text + "No description".color(theme.light)+char(10)
			continue
		end if
		text = text + entry.value.description.color(theme.light) + char(10)
	end for

	print(text)
end function

commandsController.register(help, "help")