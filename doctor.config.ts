import type { ReactDoctorConfig } from 'react-doctor/api'

export default {
  ignore: {
    rules: ['deslop/unused-dev-dependency'],
    files: ['src/components/ui/**', '.next/**', 'node_modules/**']
  }
} satisfies ReactDoctorConfig
