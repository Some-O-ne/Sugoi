import_code("color.gs")
import_code("checks.gs")

list.map = function(callback)
	for i in range(0, self.len - 1)
		self[i] = callback(self[i], i, self)
	end for
	return self
end function

list.removeAll = function(str)
	copy = []
	if not checks.isA(@str, string) then
		return null
	end if

	for i in range(0, self.len - 1)
		if self[i] != str then
			copy.push(self[i])
		end if
	end for

	return copy
end function

string.color = function(c)
	
	if @c isa globals.color then
		return "<color=#" + c.getHex + ">" + self + "</color>"
	end if
	colored = ""

	for i in range(0, self.len - 1)
		d = i / self.len
		colored = colored + "<color=#" + c(d).getHex + ">" + self[i] + "</color>"
	end for

	return colored
end function

string.capitalize = function(self)
	
	if self.len < 1 then
		return ""
	end if
	return self[0].upper + self[1 : ]
end function

number.isBetween = function(a, b)
	return self >= a and self <= b
end function
