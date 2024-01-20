checks = {}

checks.isA = function(object, type)
	if @object isa list and @type isa list then
		
		if object.len != type.len then
			return false
		end if

		for i in range(0, object.len - 1)
			
			if not self.isA(object[i], type[i]) then
				return false
			end if
		end for

		return true
	end if
	return @object isa @type
end function

checks.type = function(object, type)
	if @object isa list and @type isa list then
		
		if object.len != type.len then
			return false
		end if

		for i in range(0, object.len - 1)
			
			if not self.type(object[i], type[i]) then
				return false
			end if
		end for

		return true
	end if
	return typeof(@object) == typeof(@type)
end function
checks.isPathAlphaNumeric = function(path)
    if not self.isA(@path,string) then return false
    return path.matches("^[A-z0-9\/\.]+$").indexes.hasIndex(0)
end function

