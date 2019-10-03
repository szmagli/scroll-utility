(setq org-confirm-babel-evaluate nil)
(defun org-babel-execute:pug (body params)
	(shell-command-to-string (concat "echo $'"  body "' | pug")))
