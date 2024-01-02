import_code("checks.gs")
import_code("sessions.gs")
import_code("file.gs")
import_code("theme.gs")
import_code("logger.gs")
command = {"__run": null, "description": "", "required": [""]}

command.execute = function(args)
	if not self.required then return self.__run()
	if not checks.type(args, self.required) then
		return false
	end if
	return self.__run(args)
end function

commands = {"__commands": {}}

commands.register = function(command, name)
	
	if not command isa globals.command or not typeof(@name) == "string" then
		return false
	end if
	commands.__commands[name] = command
	return true
end function

commands.tryExecute = function(name, args)
	
	if not @name isa string or not @args isa list then
		return false
	end if
	
	if not self.__commands.hasIndex(name) then
		return false
	end if
	return self.__commands[name].execute(args)
end function

ex = new command
ex.description = "Exits Sugoi!"
ex.required = [] 
ex.__run = @exit
commands.register(ex,"exit")
cd = new command
cd.required = ["string"]
cd.description = "Switches current session's working folder"

cd.__run = function(args)
	path = args[0]
	file = new fileHandler
	file.init(sessions.getCurrentSession.object, sessions.getCurrentSession.dir)
	if not file.changeDir(path) then return logger.log(s.dir+"/"+path+" doesn't exist",1)
	sessions.__sessions[sessions.current].dir = file.getDir
	return true
end function

commands.register(cd, "cd")

ls = new command
ls.required = []
ls.description = "Show contents of current folder"
ls.__run = function
	s = sessions.getCurrentSession
	file = new fileHandler
	file.init(s.object, s.dir)
	content = file.getContents()
	text = ""
	for file in content
		if file.has_permission("w") then 
			color = theme.success
		else if file.has_permission("x") then
			color = theme.warning
		else
			color = theme.error
		end if

		text = text + file.permissions.color(color) + " "
		text = text + file.size.color(theme.base) + " "
		text = text + file.owner.color(theme.highlightA) + " "
		text = text + file.group.color(theme.highlightA) + " "
		text = text + file.name.color(theme.light)
		text = text + "\n"
	end for
	print(format_columns(text))
end function
commands.register(ls,"ls")

cat = new command
cat.description = "Views a file"
cat.required = ["string"]
cat.__run = function(args)
	s = sessions.getCurrentSession
	filename = args[0]
	file = new fileHandler
	file.init(s.object, s.dir)
	if not file.changeDir(filename) then return logger.log(s.dir+"/"+filename+" doesn't exist",1)
	if file.getFile.is_binary then return logger.log(s.dir+"/"+filename+" is a binary",1)
	if file.isFolder then return logger.log(s.dir+"/"+filename+" is a folder",1)
	print(file.getFile.get_content.color(theme.highlightA))
end function
commands.register(cat,"cat")

nmap = new command
nmap.description = "Scans ports on a ip"
nmap.required = ["string"]
nmap.__run = function(args)
	ip = args[0]
	if not is_valid_ip(ip) then return logger.log(ip+" is not a valid ip",2)
	if is_lan_ip(ip) then
		router = get_router
	else 
		router = get_router(ip)
	end if
	if not router then return logger.log("Couldn't get router",2)
	if not is_lan_ip(ip) then
		ports = router.used_ports
	 else
		ports = router.device_ports(ip)
	 end if
	if not ports then return logger.log("IP not found",2)
	text = "0".color(theme.base)+ " " + "open".color(theme.success) + " "+("kernel_router "+router.kernel_version).color(theme.highlightA) + "\n"

	for port in ports
		if port.is_closed then 
			_ = "closed".color(theme.error)
		else
			_ = "open".color(theme.success)
		end if
			text = text + str(port.port_number).color(theme.base) + " " + _ + " " + router.port_info(port).color(theme.highlightA) + "\n"
	end for
	print(format_columns(text))
end function
commands.register(nmap,"nmap")

help = new command
help.description = "Help on commands"
help.required = []
help.__run = function(args)
	text = ""
	for entry in commands.__commands
		text = text + entry.key.color(theme.highlightA)+" "
		for arg in entry.value.required
			text = text + ("["+arg+"] ").color(theme.highlightB)
		end for
		text = text + "- "
		text = text + entry.value.description.color(theme.light) + "\n"
	end for
	print(text)
end function
commands.register(help,"help")