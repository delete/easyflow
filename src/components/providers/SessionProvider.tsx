import * as firebase from 'firebase/app';
import 'firebase/auth';
import {
  useContext,
  createContext,
  PropsWithChildren,
  useState,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import cookies from 'js-cookie';

import UserDocument from 'documents/user.doc';

interface SessionContextProps {
  user: firebase.User;
  initializing: boolean;
  userDoc: UserDocument;
  isLogged: boolean;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextProps>({
  user: null,
  initializing: true,
  userDoc: null,
  isLogged: false,
  logout: null,
});

export const SessionProvider = ({ children }: PropsWithChildren<any>) => {
  const session = useProvideSession();
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

const useProvideSession = () => {
  const router = useRouter();

  const [user, setUser] = useState<firebase.User>();
  const [userDoc, setUserDoc] = useState<UserDocument>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  const logout = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        cookies.remove('auth');
        router.push('/');
        setUser(null);
      })
      .catch(console.log);
  };

  useEffect(() => {
    const cookie = cookies.get('auth');
    if (!cookie) {
      setInitializing(false);
      return;
    }

    const u = JSON.parse(cookie);
    setUser(u);

    const userDoc = new UserDocument(`users/${u.email}`);
    setUserDoc(userDoc);

    firebase
      .firestore()
      .collection('users')
      .doc(u.email)
      .set({
        username: u.displayName,
        email: u.email,
        photo: u.photoURL,
        roles: {},
        token: u.token,
      })
      .then(() => setInitializing(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, initializing, userDoc, isLogged: !!user, logout };
};

export const useSession = () => {
  return useContext(SessionContext);
};
