import_code("libs/math.gs")
import_code("libs/builtinplus.gs")
import_code("libs/color.gs")
import_code("libs/checks.gs")
import_code("libs/sessions.gs")
import_code("libs/commands.gs")
import_code("libs/cgui.gs")
import_code("libs/file.gs")
import_code("libs/logger.gs")

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
	input = user_input(cgui.prompt).split(" ")
	if input.len < 1 then continue
	error = commandsController.tryExecute(input[0],input[1:])
end while
