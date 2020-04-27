import React, { useEffect, useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

const NeverUseZhihu: React.FC = () => {
  const [open, setOpen] = useState(true)
  useEffect(() => {
    if (!/zhihu.com/.test(document.referrer)) {
      setOpen(false)
    }
  }, [])
  return (
    <Snackbar
      open={open}
      onClose={() => setOpen(false)}
    >
      <Alert
        color='warning'
        onClose={() => setOpen(false)}
      >
        I support you to build your own blog
        instead of using Zhihu.com
      </Alert>
    </Snackbar>
  )
}

export default NeverUseZhihu
