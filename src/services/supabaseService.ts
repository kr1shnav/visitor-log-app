import { supabase } from '../lib/supabase';

export const createVisitor = async (visitor: any) => {
  const { data, error } = await supabase
    .from('visitors')
    .insert([visitor])
    .select();

  if (error) throw error;

  return data;
};

export const getVisitors = async () => {
  const { data, error } = await supabase
    .from('visitors')
    .select('*')
    .order('created_at', {
      ascending: false,
    });

  if (error) throw error;

  return data;
};

export const uploadVisitorPhoto = async (
  imageUri: string,
) => {
  try {
    const fileName = `visitor-${Date.now()}.jpg`;

    const response = await fetch(imageUri);

    const arrayBuffer =
      await response.arrayBuffer();

    const { error } =
      await supabase.storage
        .from('visitor-photos')
        .upload(
          fileName,
          arrayBuffer,
          {
            contentType:
              'image/jpeg',
            upsert: true,
          },
        );

    if (error) {
      throw error;
    }

    const { data } =
      supabase.storage
        .from('visitor-photos')
        .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.log(
      'PHOTO UPLOAD ERROR:',
      error,
    );
    throw error;
  }
};

export const checkoutVisitor = async (id: string) => {
  const { data, error } = await supabase
    .from('visitors')
    .update({
      status: 'CHECKED_OUT',
      out_time: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;

  return data;
};
