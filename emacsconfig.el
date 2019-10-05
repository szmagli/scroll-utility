(setq org-confirm-babel-evaluate nil)
(defun org-babel-execute:pug (body params)
	(shell-command-to-string (concat "echo $'"  body "' | pug")))

;; (defun org-babel-execute:tsx (body params)
;; 	(shell-command-to-string (concat "cat > ")))

;; (org-src-lang-modes
;;    '(("tsx" . typescript-tsx)))
