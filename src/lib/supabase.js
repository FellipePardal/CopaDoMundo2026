import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://vwtllbpgszqfuewubzsd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dGxsYnBnc3pxZnVld3VienNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNDgzODksImV4cCI6MjA5MDYyNDM4OX0.mCbrWMnHPo9mvxOo2gmw5WmmFFM4Io1y7TjTmORcL_U'
)
