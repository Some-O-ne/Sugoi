import_code("color.gs")
import_code("checks.gs")
import_code("builtinplus.gs")
import_code("theme.gs")
import_code("sessions.gs")

cgui = {}

cgui.logo = function(centered, size, colorFunction, text)
	logo = ""
	if centered then
		logo = logo + "<align=center>"
	end if
	logo = logo + "<size=" + size + "px>"
	logo = logo + text.color(@colorFunction)
	print(logo)
end function

cgui.theme = function()
	text = ""

	for c in theme
		text = text + c.key.color(c.value) + " "
	end for

	print(text)
end function

cgui.prompt = function()
	s = sessions.getCurrentSession
	prompt = "——<mspace=9px>—[</mspace>"
	prompt = prompt + typeof(s.object).upper[0].color(theme.highlightA)
	prompt = prompt + "<mspace=7px>]—[</mspace>"
	prompt = prompt + s.user.color(theme.highlightB)
	prompt = prompt + "<mspace=7px>]—[</mspace>"
	prompt = prompt + s.globalIP.color(theme.highlightA)
	prompt = prompt + " -<mspace=1px>-></mspace> "
	prompt = prompt + s.localIP.color(theme.highlightB)
	prompt = prompt + "<mspace=7px>]—(</mspace>"
	prompt = prompt + s.dir.color(theme.light)
	prompt = prompt + ")<pos=-5px><voffset=-8px>|<pos=-5px><voffset=-24px>|<voffset=-33px><pos=0px>———<space=-7px><voffset=-35px>> "
	return prompt.color(theme.base)
end function

