alter table public.uploaded_files add column if not exists analysis text;
alter table public.uploaded_files add column if not exists ocr_text text;
alter table public.uploaded_files add column if not exists analysis_status text not null default 'none';
alter table public.uploaded_files add column if not exists analysis_model text;
alter table public.pets add column if not exists photo_path text;