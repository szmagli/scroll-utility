(setq org-confirm-babel-evaluate nil)
(defun org-babel-execute:pug (body params)
	(shell-command-to-string (concat "echo $'"  body "' | pug")))

;; (defun after-org  (progn (org-html-export-to-html) (shell-command "mv README.html index.html")))
;; (add-hook 'org-mode-hook
;;   (lambda ()
;;     (add-hook 'after-save-hook  'after-org nil 'make-it-local)))

;; (defun org-babel-execute:tsx (body params)
;; 	(shell-command-to-string (concat "cat > ")))

;; (org-src-lang-modes
;;    '(("tsx" . typescript-tsx)))
