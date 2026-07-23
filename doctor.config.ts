import type { ReactDoctorConfig } from 'react-doctor/api'

export default {
  ignore: {
    rules: ['deslop/unused-dev-dependency'],
    files: ['components/ui/**']
  }
} satisfies ReactDoctorConfig
