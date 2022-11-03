export default function ({ $auth }) {
    $auth.onError((_name, error) => {
      console.log({ message: error })
    })
  }