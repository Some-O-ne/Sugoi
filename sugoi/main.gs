import_code("libs/math.gs")
import_code("libs/commands.gs")
import_code("libs/cgui.gs")


init = function(path)
	init = fileHandler(get_shell,path)
	if commandsController.tryExecuteFile(init) then logger.log("found init.sugoi",0)
end function
init("/home/"+active_user+"/Config/init.sugoi")
globals.remove("init")

_ = function(d)
	c = new color
	c.HSVfill(math.clamp(d*360,0,360),0.5,1)
	return c
end function

cgui.logo(true,100,@_,"Sugoi!")
print
cgui.theme()
print
while true
	error = commandsController.tryExecuteString(user_input(cgui.prompt))
end while
