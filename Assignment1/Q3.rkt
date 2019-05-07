#lang racket

;; Signature: ngrams(list-of-symbols, n)
;; Purpose: Return a list of consecutive n symbols
;; Type: [List(Symbol) * Number -> List(List(Symbol))]
;; Precondition: n <= length(list-of-symbols)
;; Tests: (ngrams '(the cat in the hat) 3) => '((the cat in) (cat in the) (in the hat))
;;        (ngrams '(the cat in the hat) 2) => '((the cat) (cat in) (in the) (the hat))
(define ngrams
  (lambda (los n)
  (if (empty? los)
    '() 
    (if (> n (length los))
        '()
    (cons(cut los n)(ngrams(cdr los) n))))
  ))

(define cut
  (lambda (los n)
    (if (= n 0)
        '()
    (cons (car los) (cut (cdr los) (- n 1))) 
    )))



;; Signature: ngrams-with-padding(list-of-symbols, n)
;; Purpose: Return a list of consecutive n symbols, padding if necessary
;; Type: [List(Symbol) * Number -> List(List(Symbol))]
;; Precondition: n <= length(list-of-symbols)
;; Tests: (ngrams-with-padding '(the cat in the hat) 3) => '((the cat in) (cat in the) (in the hat) (the hat *) (hat * *))
;;        (ngrams-with-padding '(the cat in the hat) 2) => '((the cat) (cat in) (in the) (the hat) (hat *))



(define ngrams-with-padding
  (lambda (los n)
    (if (empty? los)
    '() 
    (cons(astrix los n)(ngrams-with-padding(cdr los) n))))
  )

(define astrix
  (lambda (los n)
    (if (= n 0)
      '()
       (if(> n (length los))
        (astrix (append los '(*)) n)
    (cons (car los) (astrix (cdr los) (- n 1))) 
    ))))