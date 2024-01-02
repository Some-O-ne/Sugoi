
session = {"object":get_shell,"globalIP":get_shell.host_computer.public_ip,"localIP":get_shell.host_computer.local_ip,"user":active_user,"dir":current_path}



sessions = {"__sessions":[session],"current":0}
sessions.getSession = function(id)
	if not self.__sessions.len-1 >= id then return null
	return self.__sessions[id]
end function
sessions.setCurrentSession = function(id)
	if not self.__sessions.len-1 >= id then return false
	self.current = id
end function
sessions.addSession = function(session)
	if not checks.check(session,globals.session) then return false
	self.__sessions.push(session)
end function
sessions.getCurrentSession = function
	return self.__sessions[self.current]
end function