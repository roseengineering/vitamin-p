
Please see the readme in my repo vitamin-d.  This is the same framework
but with modifications and substitutions.  

Namely, this implementation of the framework uses picodom/picodom instead
of nolanlawson/vdom-serialized-patch and Matt-Esch/virtual-dom.
Also there is no diff.  The backend web worker sends the complete virtual
dom back over to the main thread.  The main thread uses it to patch the
dom instead of a diff.

