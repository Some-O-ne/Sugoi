import_code("checks.gs")
import_code("sessions.gs")
import_code("file.gs")
import_code("theme.gs")
import_code("logger.gs")
command = {"args":[],"__run":function()

end function}
command.execute = function(args)
	if not self.args then return self.__run
    return self.__run(args)
end function


commandsController = {"__commands":{}}
commandsController.tryExecute = function(name,args)
	if not self.__commands.hasIndex(name) then return logger.log("Command doesn't exist",1)
    fulfilledArgs = []
	args.fillUntil(self.__commands[name].args.len,"")
    for arg in self.__commands[name].args
		argCorrect = ArgsValidator[arg.name](args[__arg_idx])
		if arg.hasIndex("options") then argCorrect = arg.options.hasIndex(args[__arg_idx])
		if argCorrect then
			fulfilledArgs.push(args[__arg_idx])
			continue
		else 
			if arg.hasIndex("default") then 
				fulfilledArgs.push(arg.default)
			else
				return 
			end if
		end if
	end for
    return self.__commands[name].execute(fulfilledArgs)
end function
commandsController.register = function(command,name)
    self.__commands[name] = command
end function

ArgsValidator = {}
ArgsValidator["ip"] = @is_valid_ip
ArgsValidator["partialIP"] = function(partialIp)
    return partialIp.matches("^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){0,2}$","m").indexes.hasIndex(0) // don't ask me how that regex works
end function
ArgsValidator["path"] = function(path)
    return path.matches("^\/{0,1}([A-z0-9.]+\/{0,1})*","m").indexes.hasIndex(0) // i made it myself, i think it works
end function
ArgsValidator["name"] = function(name)
	match = name.matches("^[A-z]+","m")
	return match.hasIndex(0) and match[0].len == name.len
end function
ArgsValidator["number"] = function(number)
	match = number.matches("^[0-9]+","m")
	return number.hasIndex(0) and match[0].len == number.len
end function








ex = new command
ex.description = "Exits Sugoi!"
ex.args = []
ex.__run = @exit
commandsController.register(ex, "exit")
cd = new command
cd.args = [{"name":"path","default":"."}]
cd.description = "Switches current session's working folder"

cd.__run = function(args)
	path = args[0]
	file = new fileHandler
	s = sessions.getCurrentSession
	file.init(s.object, s.dir)
	
	if not file.changeDir(path) then
		return logger.log(path + " doesn't exist", 1)
	end if
	sessions.__sessions[sessions.current].dir = file.getDir
	return true
end function

commandsController.register(cd, "cd")
ls = new command
ls.args = []
ls.description = "Show contents of current folder"

ls.__run = function()
	s = sessions.getCurrentSession
	file = new fileHandler
	file.init(s.object, s.dir)
	content = file.getContents
	text = ""

	for file in content
		color = theme.warning
		if file.has_permission("r") and file.has_permission("w") then color = theme.success
		text = text + file.permissions.color(theme.base) + " "
		_ = ("r"*file.has_permission("r")+"w"*file.has_permission("w")+"x"*file.has_permission("x"))
		if not _ then 
			text = text + "no".color(theme.error) + " "
		else
			text = text + _.color(color) + " "
		end if
		text = text + file.size.color(theme.highlightA) + " "
		text = text + file.owner.color(theme.highlightB) + " "
		text = text + file.group.color(theme.highlightB) + " "
		text = text + file.name.color(theme.light)
		text = text + "\n"
	end for

	print(format_columns(text))

end function

commandsController.register(ls, "ls")
cat = new command
cat.description = "Views a file"
cat.args = [{"name":"path"}]

cat.__run = function(args)
	s = sessions.getCurrentSession
	filename = args[0]
	file = new fileHandler
	file.init(s.object, s.dir)
	
	if not file.changeDir(filename) then
		return logger.log( filename + " doesn't exist", 1)
	end if
	if file.isFolder then
		return logger.log( filename + " is a folder", 1)
	end if
	if file.getFile.is_binary then
		return logger.log( filename + " is a binary", 1)
	end if
	

	if not file.has_permission("r") then
		return logger.log("No permission to read " + filename,2)
	end if

	print(file.getFile.get_content.color(theme.highlightA))
end function

commandsController.register(cat, "cat")
nmap = new command
nmap.description = "Scans ports on a ip"
nmap.args = [{"name":"ip"}]

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
	for lan in router.devices_lan_ip()
		ports = ports + router.device_ports(lan)
	end for

	for port in ports
		if port.is_closed then
			_ = "closed".color(theme.error)
		else
			_ = "open".color(theme.success)
		end if
		text = text + str(port.port_number).color(theme.base) + " " + _ + " " + router.port_info(port).color(theme.highlightA) +" "+ port.get_lan_ip().color(theme.light) + "\n"
	end for
	print(("ESSID: "+router.essid_name).color(theme.highlightA))
	print(("BSSID: "+router.bssid_name).color(theme.highlightB))
	print(format_columns(text))

end function
commandsController.register(nmap, "nmap")

help = new command
help.description = "Help on commands"
help.args = []

help.__run = function(args)
	text = ""

	for entry in commandsController.__commands
		text = text + entry.key.color(theme.highlightA) + " "

		for arg in entry.value.args
            if not arg.hasIndex("default") and not arg.hasIndex("options") then text = text + ("[" + arg.name + "] ").color(theme.highlightB)
            if arg.hasIndex("default") and not arg.hasIndex("options") then text = text + ("(" + arg.name + ") ").color(theme.highlightB)
            if arg.hasIndex("options") and not arg.hasIndex("default") then text = text + ("(" + arg.options.join("|") + ") ").color(theme.highlightB)
		end for

		text = text + " - ".color(theme.base)
		text = text + entry.value.description.color(theme.light) + "\n"
	end for

	print(text)
end function

commandsController.register(help, "help")