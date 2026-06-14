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

export const uploadVisitorPhoto = async (imageUri: string) => {
  const response = await fetch(imageUri);

  const blob = await response.blob();

  const fileName = `visitor-${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from('visitor-photos')
    .upload(fileName, blob, {
      contentType: 'image/jpeg',
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from('visitor-photos')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

export const checkoutVisitor = async (
  id: string
) => {
  const { data, error } =
    await supabase
      .from('visitors')
      .update({
        status: 'CHECKED_OUT',
        out_time: new Date().toISOString(),
      })
      .eq('id', id);

  if (error) throw error;

  return data;
};
