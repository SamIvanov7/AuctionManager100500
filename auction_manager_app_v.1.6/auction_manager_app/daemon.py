import sys
import os
import time
import atexit
import signal


class color_print:
	@staticmethod
	def print_fail(message):
		sys.stderr.write('\x1b[1;31m'+message.strip()+'\x1b[0m'+'\n')

	@staticmethod
	def print_pass(message):
		sys.stdout.write('\x1b[1;32m'+message.strip()+'\x1b[0m'+'\n')

	@staticmethod
	def print_warn(message):
		sys.stderr.write('\x1b[1;33m'+message.strip()+'\x1b[0m'+'\n')

	@staticmethod
	def print_info(message):
		sys.stdout.write('\x1b[1;34m'+message.strip()+'\x1b[0m'+'\n')

	@staticmethod
	def print_bold(message):
		sys.stdout.write('\x1b[1;37m'+message.strip()+'\x1b[0m'+'\n')

class daemon:
	def __init__(self, pidfile):
		self.pidfile = pidfile
	
	def daemonize(self):
		try: 
			pid = os.fork() 
			if pid > 0:
				# exit first parent
				sys.exit(0) 
		except OSError as err: 
			color_print.print_fail('fork #1 failed: {0}\n'.format(err))
			sys.exit(1)
		# decouple from parent environment
		os.chdir('/') 
		os.setsid() 
		os.umask(0) 
		# do second fork
		try: 
			pid = os.fork() 
			if pid > 0:
				# exit from second parent
				sys.exit(0) 
		except OSError as err: 
			color_print.print_fail('fork #2 failed: {0}\n'.format(err))
			sys.exit(1) 
		# redirect standard file descriptors
		sys.stdout.flush()
		sys.stderr.flush()
		si = open(os.devnull, 'r')
		so = open(os.devnull, 'a+')
		se = open(os.devnull, 'a+')
		os.dup2(si.fileno(), sys.stdin.fileno())
		os.dup2(so.fileno(), sys.stdout.fileno())
		os.dup2(se.fileno(), sys.stderr.fileno())
		# write pidfile
		atexit.register(self.delpid)
		pid = str(os.getpid())
		with open(self.pidfile,'w+') as f:
			f.write(pid + '\n')

	def delpid(self):
		os.remove(self.pidfile)

	def start(self):
		# Check for a pidfile to see if the daemon already runs
		try:
			with open(self.pidfile,'r') as pf:
				pid = int(pf.read().strip())
		except IOError:
			pid = None
		if pid:
			message = 'pidfile {0} already exist. Daemon already running?\n'
			color_print.print_warn(message.format(self.pidfile))
			sys.exit(1)
		# Start the daemon
		self.daemonize()
		self.run()

	def stop(self):
		# Get the pid from the pidfile
		try:
			with open(self.pidfile,'r') as pf:
				pid = int(pf.read().strip())
		except IOError:
			pid = None
		if not pid:
			message = 'pidfile {0} does not exist. Daemon not running?\n'
			color_print.print_warn(message.format(self.pidfile))
			return # not an error in a restart
		# Try killing the daemon process	
		try:
			while 1:
				os.kill(pid, signal.SIGTERM)
				time.sleep(0.1)
		except OSError as err:
			e = str(err.args)
			if e.find("No such process") > 0:
				if os.path.exists(self.pidfile):
					os.remove(self.pidfile)
			else:
				color_print.print_fail(str(err.args))
				sys.exit(1)

	def restart(self):
		self.stop()
		self.start()

	def status(self):
		try:
			with open(self.pidfile,'r') as pf:
				pid = int(pf.read().strip())
		except IOError:
			pid = None
		if pid:
			message = 'Active (running)\n'
		else:
			message = 'No active\n'
		color_print.print_info(message)

	def run(self):
		'''You should override this method when you subclass Daemon.
		It will be called after the process has been daemonized by 
		start() or restart().'''

