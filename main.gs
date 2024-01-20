import_code("libs/libs.gs")
import_code("libs/math.gs")
import_code("libs/commands.gs")
import_code("libs/cgui.gs")


init = function(path)
	init = fileHandler(get_shell,path)
	if not init then return
	if cgui.question("init file found at "+path+" do you want to load it?") == "n" then return
	if commandsController.tryExecuteFile(init) then logger.log("found init.sugoi",0)
end function
init("/home/"+active_user+"/Config/init.sugoi")
globals.remove("init")


cgui.logo(true,100,@theme.rainbow,"Sugoi!")
print
cgui.theme()
print
// todo - libs system
while true
	commandsController.tryExecuteString(user_input(cgui.prompt))
end while
